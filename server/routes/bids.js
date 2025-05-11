const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middlewares/auth");
const {
  getBidsByAuction,
  createBid,
} = require("../controllers/bidsController");

// Получить все ставки по аукциону
// GET /api/auctions/:auctionId/bids
router.get("/", getBidsByAuction);

// Сделать ставку (только авторизованные покупатели)
// POST /api/auctions/:auctionId/bids
router.post("/", auth, createBid);

module.exports = router;
