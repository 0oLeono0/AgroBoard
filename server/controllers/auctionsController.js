const db = require("../db");

// Получить все аукционы
exports.getAllAuctions = (req, res) => {
  const sql = `
    SELECT
      a.id,
      a.ad_id,
      a.start_price,
      a.current_price,
      a.start_at,
      a.end_at,
      a.status,
      a.created_at,
      ads.title AS ad_title,
      ads.user_id AS farmer_id
    FROM auctions a
    JOIN ads ON a.ad_id = ads.id
    ORDER BY a.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching auctions:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    res.json(rows);
  });
};

// Получить один аукцион по ID
exports.getAuctionById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      a.id,
      a.ad_id,
      a.start_price,
      a.current_price,
      a.start_at,
      a.end_at,
      a.status,
      a.created_at,
      ads.title AS ad_title,
      ads.user_id AS farmer_id
    FROM auctions a
    JOIN ads ON a.ad_id = ads.id
    WHERE a.id = ?
  `;
  db.get(sql, [id], (err, auction) => {
    if (err) {
      console.error(`Error fetching auction ${id}:`, err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!auction) {
      return res.status(404).json({ error: "Аукцион не найден" });
    }
    res.json(auction);
  });
};

// Создать новый аукцион
exports.createAuction = (req, res) => {
  const { ad_id, start_price, start_at, end_at } = req.body;
  const userId = req.user.id;

  if (!ad_id || !start_price || !start_at || !end_at) {
    return res
      .status(400)
      .json({ error: "Нужно ad_id, start_price, start_at и end_at" });
  }

  // Проверяем, что пользователь — владелец объявления
  db.get("SELECT user_id FROM ads WHERE id = ?", [ad_id], (err, ad) => {
    if (err) {
      console.error("Error checking ad owner:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!ad) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }
    if (ad.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Нет права создавать аукцион для этого объявления" });
    }

    const sql = `
      INSERT INTO auctions (ad_id, start_price, current_price, start_at, end_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [ad_id, start_price, start_price, start_at, end_at],
      function (err) {
        if (err) {
          console.error("Error creating auction:", err);
          return res.status(500).json({ error: "Не удалось создать аукцион" });
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  });
};

// Обновить аукцион (например, закрыть, изменить status или цены)
exports.updateAuction = (req, res) => {
  const { id } = req.params;
  const { status, current_price, end_at } = req.body;
  const userId = req.user.id;

  // Проверяем владельца через JOIN
  const ownerSql = `
    SELECT ads.user_id AS farmer_id
    FROM auctions
    JOIN ads ON auctions.ad_id = ads.id
    WHERE auctions.id = ?
  `;
  db.get(ownerSql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching auction owner:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!row) {
      return res.status(404).json({ error: "Аукцион не найден" });
    }
    if (row.farmer_id !== userId) {
      return res
        .status(403)
        .json({ error: "Нет прав на редактирование этого аукциона" });
    }

    // Собираем динамический UPDATE
    const fields = [];
    const params = [];
    if (status) {
      fields.push("status = ?");
      params.push(status);
    }
    if (current_price != null) {
      fields.push("current_price = ?");
      params.push(current_price);
    }
    if (end_at) {
      fields.push("end_at = ?");
      params.push(end_at);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: "Нет полей для обновления" });
    }
    params.push(id);
    const sql = `UPDATE auctions SET ${fields.join(", ")} WHERE id = ?`;
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error updating auction:", err);
        return res.status(500).json({ error: "Не удалось обновить аукцион" });
      }
      res.json({ updated: this.changes });
    });
  });
};

// Удалить аукцион
exports.deleteAuction = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Проверяем владельца
  const ownerSql = `
    SELECT ads.user_id AS farmer_id
    FROM auctions
    JOIN ads ON auctions.ad_id = ads.id
    WHERE auctions.id = ?
  `;
  db.get(ownerSql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching auction owner:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!row) {
      return res.status(404).json({ error: "Аукцион не найден" });
    }
    if (row.farmer_id !== userId) {
      return res
        .status(403)
        .json({ error: "Нет прав на удаление этого аукциона" });
    }

    db.run("DELETE FROM auctions WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("Error deleting auction:", err);
        return res.status(500).json({ error: "Не удалось удалить аукцион" });
      }
      res.json({ deleted: this.changes });
    });
  });
};
