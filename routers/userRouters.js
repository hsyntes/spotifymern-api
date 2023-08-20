const express = require("express");

const { signup, login, verifyToken } = require("../controllers/authController");

const {
  getUsers,
  getUser,
  getCurrentUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// * Protect after this
router.use(verifyToken);

router.get("/authorization/current-user", getCurrentUser);

module.exports = router;
