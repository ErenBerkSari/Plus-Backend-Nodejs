const express = require("express");
const {
  createContact,
  getContact,
  updateContact,
} = require("../controllers/ContactController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/createContact", authMiddleware, createContact);
router.get("/getContact", getContact);
router.put("/updateContact", authMiddleware, updateContact);

module.exports = router;
