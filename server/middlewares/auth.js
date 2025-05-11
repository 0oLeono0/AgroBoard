const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Неверный формат токена" });
  }
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Некорректный или просроченный токен" });
  }
}

module.exports = auth;
