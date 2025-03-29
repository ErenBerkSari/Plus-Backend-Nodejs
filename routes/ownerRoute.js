const express = require("express");
const {
  createOwner,
  getAllOwner,
  updateOwner,
  deleteOwner,
} = require("../controllers/OwnerController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/addOwner",
  authMiddleware,
  upload.single("ownerImage"),
  createOwner
);
router.get("/getAllOwner", getAllOwner);
router.put(
  "/updateOwner/:id",
  authMiddleware,
  upload.single("ownerImage"),
  updateOwner
);
router.delete("/deleteOwner/:id", authMiddleware, deleteOwner);

module.exports = router;
