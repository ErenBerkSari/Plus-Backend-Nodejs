const express = require("express");
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/addProduct",
  authMiddleware,
  upload.single("productImage"),
  createProduct
);
router.get("/getAllProduct", getAllProduct);
router.put(
  "/updateProduct/:id",
  authMiddleware,
  upload.single("productImage"),
  updateProduct
);
router.delete("/deleteProduct/:id", authMiddleware, deleteProduct);

module.exports = router;
