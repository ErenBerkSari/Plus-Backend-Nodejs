const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
