const db = require("../db");

// Получить все ставки для конкретного аукциона
exports.getBidsByAuction = (req, res) => {
  const { auctionId } = req.params;
  const sql = `
    SELECT
      b.id,
      b.auction_id,
      b.user_id,
      users.email AS bidder_email,
      b.amount,
      b.placed_at
    FROM bids b
    JOIN users ON b.user_id = users.id
    WHERE b.auction_id = ?
    ORDER BY b.placed_at ASC
  `;
  db.all(sql, [auctionId], (err, rows) => {
    if (err) {
      console.error("Error fetching bids:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    res.json(rows);
  });
};

// Сделать новую ставку
exports.createBid = (req, res) => {
  const { auctionId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  if (amount == null) {
    return res.status(400).json({ error: "Требуется сумма ставки" });
  }

  // Проверяем, что аукцион открыт и получаем текущую цену
  db.get(
    `SELECT current_price, status FROM auctions WHERE id = ?`,
    [auctionId],
    (err, auction) => {
      if (err) {
        console.error("Error checking auction:", err);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
      }
      if (!auction) {
        return res.status(404).json({ error: "Аукцион не найден" });
      }
      if (auction.status !== "open") {
        return res.status(400).json({ error: "Аукцион закрыт" });
      }
      if (amount <= auction.current_price) {
        return res
          .status(400)
          .json({ error: "Ставка должна быть больше текущей цены" });
      }

      // Записываем ставку
      db.run(
        `INSERT INTO bids (auction_id, user_id, amount) VALUES (?, ?, ?)`,
        [auctionId, userId, amount],
        function (err) {
          if (err) {
            console.error("Error creating bid:", err);
            return res.status(500).json({ error: "Не удалось сделать ставку" });
          }
          // Обновляем current_price в auctions
          db.run(
            `UPDATE auctions SET current_price = ? WHERE id = ?`,
            [amount, auctionId],
            (err) => {
              if (err) console.error("Error updating auction price:", err);
            }
          );
          res.status(201).json({ id: this.lastID });
        }
      );
    }
  );
};
