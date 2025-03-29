const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: "",
  },
  heroDesc: {
    type: String,
    default: "",
  },
  heroVideo: {
    type: String,
    default: null, // Varsayılan olarak boş bırak
  },
  heroImage: {
    type: String,
    default: null, // Varsayılan olarak boş bırak
  },
});

module.exports = mongoose.model("Hero", HeroSchema);
