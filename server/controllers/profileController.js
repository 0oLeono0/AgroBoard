const db = require("../db");

// GET /api/profile — получить данные текущего пользователя
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT id, email, role, inn, phone, created_at
    FROM users
    WHERE id = ?
  `;
  db.get(sql, [userId], (err, user) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(user);
  });
};

// PUT /api/profile — обновить профиль (inn, phone)
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { inn, phone } = req.body;
  if (inn == null && phone == null) {
    return res
      .status(400)
      .json({ error: "Нужно передать хотя бы inn или phone" });
  }

  const fields = [];
  const params = [];
  if (inn != null) {
    fields.push("inn = ?");
    params.push(inn);
  }
  if (phone != null) {
    fields.push("phone = ?");
    params.push(phone);
  }
  params.push(userId);

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ error: "Не удалось обновить профиль" });
    }
    // Вернём обновлённый профиль
    db.get(
      `SELECT id, email, role, inn, phone, created_at FROM users WHERE id = ?`,
      [userId],
      (err, updated) => {
        if (err) {
          console.error("Error fetching updated profile:", err);
          return res.status(500).json({ error: "Внутренняя ошибка сервера" });
        }
        res.json(updated);
      }
    );
  });
};
