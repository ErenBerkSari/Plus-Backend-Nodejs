const express = require("express");
const {
  createAbout,
  getAbout,
  updateAbout,
} = require("../controllers/AboutController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/createAbout", authMiddleware, createAbout);
router.get("/getAbout", getAbout);
router.put(
  "/updateAbout",
  authMiddleware,
  upload.fields([
    { name: "aboutImage", maxCount: 1 },
    { name: "aboutVideo", maxCount: 1 },
  ]),
  updateAbout
);
module.exports = router;
