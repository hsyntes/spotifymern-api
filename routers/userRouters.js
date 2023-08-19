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

router.get("/", getUsers);
router.get("/:userId", getUser);

router.get("/current-user", verifyToken, getCurrentUser);

module.exports = router;
