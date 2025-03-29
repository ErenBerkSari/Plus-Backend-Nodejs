const express = require("express");
const {
  createWhyUs,
  getWhyUs,
  updateWhyUs,
} = require("../controllers/WhyUsController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/createWhyUs", authMiddleware, createWhyUs);
router.get("/getWhyUs", getWhyUs);
router.put("/updateWhyUs", authMiddleware, updateWhyUs);

module.exports = router;
