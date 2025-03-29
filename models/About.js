const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  aboutIntro: {
    type: String,
    default: "",
  },
  aboutList: {
    type: [String],
    default: [],
  },
  aboutLastText: {
    type: String,
    default: "",
  },
  aboutVideo: {
    type: String,
    default: null, // Varsayılan olarak boş bırak
  },
  aboutImage: {
    type: String,
    default: null, // Varsayılan olarak boş bırak
  },
  aboutContact: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("About", AboutSchema);
