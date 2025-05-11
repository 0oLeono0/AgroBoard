const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Все запросы по профилю требуют авторизации
router.use(auth);

// GET  /api/profile — получить профиль
router.get("/", getProfile);

// PUT  /api/profile — обновить профиль
router.put("/", updateProfile);

module.exports = router;
