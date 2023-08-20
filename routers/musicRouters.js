const express = require("express");

const {
  getMusics,
  getMusic,
  getMusicsByCategory,
  searchMusics,
  getCategories,
  getAllMusics,
  getRecommendedMusics,
} = require("../controllers/musicController");

const router = express.Router();

router.get("/", getMusics);
router.get("/all", getAllMusics);
// router.get("/id/:id", getMusic);
router.get("/categories", getCategories);
router.get("/category/:category", getMusicsByCategory);
router.get("/recommended", getRecommendedMusics);
router.get("/search/:name", searchMusics);

module.exports = router;
