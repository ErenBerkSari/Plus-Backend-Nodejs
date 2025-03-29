const mongoose = require("mongoose");

const WhyUsSchema = new mongoose.Schema({
  whyUsTitle: {
    type: String,
    default: "",
  },
  whyUsMainText: {
    type: String,
    default: "",
  },
  features: [
    {
      icon: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("WhyUs", WhyUsSchema);
