const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    default: "",
  },
  ownerDesc: {
    type: String,
    default: "",
  },
  ownerTitle: {
    type: String,
    default: "", // Varsayılan olarak boş bırak
  },
  ownerImage: {
    type: String,
    default: "", // Varsayılan olarak boş bırak
  },
  cloudinaryId: { type: String },
});

module.exports = mongoose.model("Owner", OwnerSchema);
