const db = require("../db");

// Получить все объявления
exports.getAllAds = (req, res) => {
  const sql = `
    SELECT
      ads.id,
      ads.title,
      ads.description,
      ads.price,
      ads.region,
      ads.created_at,
      ads.user_id,
      users.email AS author_email
    FROM ads
    LEFT JOIN users ON ads.user_id = users.id
    ORDER BY ads.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching ads:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    res.json(rows);
  });
};

// Получить одно объявление по ID
exports.getAdById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      ads.id,
      ads.title,
      ads.description,
      ads.price,
      ads.region,
      ads.created_at,
      ads.user_id,
      users.email AS author_email
    FROM ads
    LEFT JOIN users ON ads.user_id = users.id
    WHERE ads.id = ?
  `;
  db.get(sql, [id], (err, ad) => {
    if (err) {
      console.error(`Error fetching ad ${id}:`, err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!ad) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }
    res.json(ad);
  });
};

// Создать новое объявление
exports.createAd = (req, res) => {
  const { title, description = "", price = 0, region = "" } = req.body;
  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  if (!title) {
    return res.status(400).json({ error: "Требуется заголовок объявления" });
  }

  const sql = `
    INSERT INTO ads (title, description, price, region, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, description, price, region, userId], function (err) {
    if (err) {
      console.error("Error creating ad:", err);
      return res.status(500).json({ error: "Не удалось создать объявление" });
    }
    res.status(201).json({ id: this.lastID });
  });
};

// Обновить существующее объявление
exports.updateAd = (req, res) => {
  const { id } = req.params;
  const { title, description, price, region } = req.body;
  const userId = req.user && req.user.id;

  // Проверяем, что пользователь — владелец объявления
  db.get("SELECT user_id FROM ads WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(`Error finding ad ${id}:`, err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!row) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }
    if (row.user_id !== userId) {
      return res.status(403).json({ error: "Нет прав для редактирования" });
    }

    const sql = `
      UPDATE ads
      SET title = ?, description = ?, price = ?, region = ?
      WHERE id = ?
    `;
    db.run(sql, [title, description, price, region, id], function (err) {
      if (err) {
        console.error(`Error updating ad ${id}:`, err);
        return res
          .status(500)
          .json({ error: "Не удалось обновить объявление" });
      }
      res.json({ updated: this.changes });
    });
  });
};

// Удалить объявление
exports.deleteAd = (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  // Проверяем, что пользователь — владелец объявления
  db.get("SELECT user_id FROM ads WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(`Error finding ad ${id}:`, err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!row) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }
    if (row.user_id !== userId) {
      return res.status(403).json({ error: "Нет прав для удаления" });
    }

    db.run("DELETE FROM ads WHERE id = ?", [id], function (err) {
      if (err) {
        console.error(`Error deleting ad ${id}:`, err);
        return res.status(500).json({ error: "Не удалось удалить объявление" });
      }
      res.json({ deleted: this.changes });
    });
  });
};
