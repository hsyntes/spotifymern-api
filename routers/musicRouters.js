const express = require("express");

const {
  getMusics,
  getMusic,
  getMusicsByCategory,
  searchMusics,
} = require("../controllers/musicController");

const router = express.Router();

router.get("/", getMusics);
router.get("/:id", getMusic);
router.get("/category/:category", getMusicsByCategory);
router.get("/search/:name", searchMusics);

module.exports = router;
