const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  contactAddress: {
    type: String,
    default: "",
  },
  contactPhone: {
    type: String,
    default: "",
  },
  contactEmail: {
    type: String,
    default: "",
  },
  contactOpeningHours: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
