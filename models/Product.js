const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    default: "",
  },
  productDesc: {
    type: String,
    default: "",
  },
  productPrice: {
    type: String,
    default: "", // Varsayılan olarak boş bırak
  },
  productImage: {
    type: String,
    default: "", // Varsayılan olarak boş bırak
  },
});

module.exports = mongoose.model("Product", ProductSchema);
