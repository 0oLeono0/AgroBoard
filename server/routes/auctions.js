const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
} = require("../controllers/auctionsController");

// Получить все аукционы
// GET /api/auctions
router.get("/", getAllAuctions);

// Получить один аукцион
// GET /api/auctions/:id
router.get("/:id", getAuctionById);

// Создать аукцион (только фермер)
// POST /api/auctions
router.post("/", auth, createAuction);

// Обновить аукцион (только фермер)
// PUT /api/auctions/:id
router.put("/:id", auth, updateAuction);

// Удалить аукцион (только фермер)
// DELETE /api/auctions/:id
router.delete("/:id", auth, deleteAuction);

module.exports = router;
