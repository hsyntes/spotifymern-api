const express = require("express");

const {
  getMusics,
  getMusic,
  getMusicsByCategory,
  searchMusics,
  getCategories,
} = require("../controllers/musicController");

const router = express.Router();

router.get("/", getMusics);
router.get("/:id", getMusic);
router.get("/categories/all", getCategories);
router.get("/category/:category", getMusicsByCategory);
router.get("/search/:name", searchMusics);

module.exports = router;
