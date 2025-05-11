require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Путь к файлу базы данных (из .env или по умолчанию в корне server/)
const dbFile = process.env.DB_PATH || path.join(__dirname, "database.db");

// Создаём подключение к SQLite
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Ошибка подключения к SQLite:", err.message);
  } else {
    console.log(`Подключено к SQLite базе данных: ${dbFile}`);
  }
});

module.exports = db;
