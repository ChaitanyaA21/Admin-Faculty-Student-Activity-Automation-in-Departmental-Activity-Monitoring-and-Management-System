const mongoose = require("mongoose");

const workShopSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    certificateUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const workShop = mongoose.model("workShop", workShopSchema);
module.exports = { workShop };
