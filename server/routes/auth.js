const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Регистрация нового пользователя
// POST /api/auth/register
router.post("/register", authController.register);

// Вход существующего пользователя
// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
