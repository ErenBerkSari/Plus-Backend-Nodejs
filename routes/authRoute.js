const express = require("express");
const {
  login,
  logout,
  refresh,
  getAuthUser,
} = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/getAuthUser", authMiddleware, getAuthUser);

module.exports = router;
