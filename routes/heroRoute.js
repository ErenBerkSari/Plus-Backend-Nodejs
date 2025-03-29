const express = require("express");
const {
  getHero,
  createHero,
  updateHero,
} = require("../controllers/HeroController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/getHero", getHero);
router.post(
  "/createHero",
  authMiddleware,
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "heroVideo", maxCount: 1 },
  ]),
  createHero
);
router.put(
  "/updateHero",
  authMiddleware,
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "heroVideo", maxCount: 1 },
  ]),
  updateHero
);

module.exports = router;
