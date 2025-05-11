const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getAllDeals,
  getDealById,
  createDeal,
  confirmDeal,
  updateDealStatus,
  getDealHistory,
} = require("../controllers/dealsController");

// Все маршруты защищены (только авторизованные)
router.use(auth);

// GET    /api/deals               — список всех сделок
router.get("/", getAllDeals);

// GET    /api/deals/:id           — конкретная сделка
router.get("/:id", getDealById);

// POST   /api/deals               — создать новую сделку
router.post("/", createDeal);

// POST   /api/deals/:id/confirm   — подтвердить контракт + PDF
router.post("/:id/confirm", confirmDeal);

// PUT    /api/deals/:id/status    — обновить статус сделки
router.put("/:id/status", updateDealStatus);

// GET    /api/deals/:id/history   — получить историю статусов
router.get("/:id/history", getDealHistory);

module.exports = router;
