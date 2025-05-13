const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Регистрация нового пользователя
exports.register = (req, res) => {
  const { email, password, phone, inn, role } = req.body;
  
  // Проверка обязательных полей
  if (!email || !password || !phone || !inn || !role) {
    return res.status(400).json({ error: "Все поля обязательны для заполнения" });
  }

  // Проверка на допустимые роли
  if (role !== "farmer" && role !== "buyer") {
    return res.status(400).json({ error: "Неверная роль" });
  }

  // Проверяем, что пользователя с таким email ещё нет
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error("Ошибка проверки существующего пользователя:", err);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
    if (row) {
      return res
        .status(409)
        .json({ error: "Пользователь уже зарегистрирован" });
    }

    // Хешируем пароль и сохраняем нового пользователя
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    const sql =
      "INSERT INTO users (email, password, phone, inn, role) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [email, hash, phone, inn, role], function (err) {
      if (err) {
        console.error("Ошибка при создании пользователя:", err);
        return res
          .status(500)
          .json({ error: "Не удалось зарегистрировать пользователя" });
      }

      // this.lastID = id вновь созданного пользователя
      res.status(201).json({
        id: this.lastID,
        email,
        role, // Добавляем роль в ответ
      });
    });
  });
};

// Вход (логин) существующего пользователя
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  // Находим пользователя в БД
  db.get(
    "SELECT id, email, password, role FROM users WHERE email = ?",
    [email],
    (err, user) => {
      if (err) {
        console.error("Ошибка при получении пользователя:", err);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
      }
      if (!user) {
        return res.status(401).json({ error: "Неверный email или пароль" });
      }

      // Сравниваем переданный пароль с хешем
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Неверный email или пароль" });
      }

      // Генерируем JWT
      const payload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    }
  );
};
