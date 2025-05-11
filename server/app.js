require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Инициализация БД (создание таблиц из schema.sql)
const schemaPath = path.join(__dirname, "models", "schema.sql");
const schemaSQL = fs.readFileSync(schemaPath, "utf8");
db.exec(schemaSQL, (err) => {
  if (err) console.error("Ошибка инициализации БД:", err);
  else console.log("База данных готова.");
});

// Маршруты
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ads", require("./routes/ads"));
app.use("/api/auctions", require("./routes/auctions"));
app.use("/api/auctions/:auctionId/bids", require("./routes/bids"));
app.use("/api/deals", require("./routes/deals"));
app.use("/api/profile", require("./routes/profile"));

// Тестовый корневой маршрут
app.get("/", (req, res) => res.send("API is running"));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
