const db = require("../db");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Получить все сделки
exports.getAllDeals = (req, res) => {
  const sql = `
    SELECT
      d.id,
      d.auction_id,
      d.ad_id,
      d.buyer_id,
      buyer.email AS buyer_email,
      d.farmer_id,
      farmer.email AS farmer_email,
      d.final_price,
      d.volume,
      d.status,
      d.contract_path,
      d.created_at
    FROM deals d
    JOIN users buyer  ON d.buyer_id  = buyer.id
    JOIN users farmer ON d.farmer_id = farmer.id
    ORDER BY d.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching deals:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    res.json(rows);
  });
};

// Получить сделку по ID
exports.getDealById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      d.*,
      buyer.email  AS buyer_email,
      farmer.email AS farmer_email
    FROM deals d
    JOIN users buyer  ON d.buyer_id  = buyer.id
    JOIN users farmer ON d.farmer_id = farmer.id
    WHERE d.id = ?
  `;
  db.get(sql, [id], (err, deal) => {
    if (err) {
      console.error(`Error fetching deal ${id}:`, err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!deal) {
      return res.status(404).json({ error: "Сделка не найдена" });
    }
    res.json(deal);
  });
};

// Создать сделку (по завершению аукциона или напрямую)
// POST /api/deals
exports.createDeal = (req, res) => {
  const { auction_id = null, ad_id, buyer_id, final_price, volume } = req.body;
  const farmer_id = req.user.id;

  if (!ad_id || !buyer_id || !final_price || !volume) {
    return res
      .status(400)
      .json({ error: "Нужны ad_id, buyer_id, final_price, volume" });
  }

  const sql = `
    INSERT INTO deals
      (auction_id, ad_id, buyer_id, farmer_id, final_price, volume)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [auction_id, ad_id, buyer_id, farmer_id, final_price, volume],
    function (err) {
      if (err) {
        console.error("Error creating deal:", err);
        return res.status(500).json({ error: "Не удалось создать сделку" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

// Подтвердить контракт и сгенерировать PDF
// POST /api/deals/:id/confirm
exports.confirmDeal = (req, res) => {
  const { id } = req.params;

  // Сгенерируем очень простой PDF в папке contracts/
  const contractDir = path.join(__dirname, "..", "contracts");
  if (!fs.existsSync(contractDir)) fs.mkdirSync(contractDir);

  const pdfPath = path.join(contractDir, `deal_${id}.pdf`);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(16).text(`Договор №${id}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Дата: ${new Date().toLocaleDateString()}`);
  doc.text(`ID сделки: ${id}`);
  doc.text(`...здесь детали сделки...`);
  doc.end();

  // Сохраняем путь к контракту
  db.run(
    `UPDATE deals SET contract_path = ?, status = 'signed' WHERE id = ?`,
    [pdfPath, id],
    function (err) {
      if (err) {
        console.error("Error updating deal:", err);
        return res.status(500).json({ error: "Не удалось обновить сделку" });
      }
      res.json({ contract_path: pdfPath });
    }
  );
};

// Обновить статус сделки
// PUT /api/deals/:id/status
exports.updateDealStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Требуется новый status" });
  }
  db.run(
    `UPDATE deals SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) {
        console.error("Error updating deal status:", err);
        return res.status(500).json({ error: "Не удалось обновить статус" });
      }
      // Запишем историю
      db.run(
        `INSERT INTO deal_history (deal_id, status) VALUES (?, ?)`,
        [id, status],
        (err) => {
          if (err) console.error("Error writing deal history:", err);
        }
      );
      res.json({ updated: this.changes });
    }
  );
};

// Получить историю сделки
// GET /api/deals/:id/history
exports.getDealHistory = (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT status, changed_at, note FROM deal_history WHERE deal_id = ? ORDER BY changed_at ASC`,
    [id],
    (err, rows) => {
      if (err) {
        console.error("Error fetching deal history:", err);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
      }
      res.json(rows);
    }
  );
};
