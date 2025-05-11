// server/routes/ads.js

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
} = require("../controllers/adsController");

// DEBUG: убедимся, что auth и createAd — функции
console.log("auth is", typeof auth, auth);
console.log("createAd is", typeof createAd);

// Теперь идёт определение роутов
router.get("/", getAllAds);
router.get("/:id", getAdById);
router.post("/", auth, createAd);
router.put("/:id", auth, updateAd);
router.delete("/:id", auth, deleteAd);

module.exports = router;
