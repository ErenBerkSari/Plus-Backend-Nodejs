const express = require("express");
const {
  getAllImages,
  uploadImage,
  deleteImage,
} = require("../controllers/GalleryController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/uploadImage",
  authMiddleware,
  upload.single("imageUrl"),
  uploadImage
);
router.get("/getAllImages", getAllImages);
router.delete("/deleteImage/:id", authMiddleware, deleteImage);

module.exports = router;
