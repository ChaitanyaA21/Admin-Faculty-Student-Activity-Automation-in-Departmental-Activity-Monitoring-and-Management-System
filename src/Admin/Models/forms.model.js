const mongoose = require("mongoose");

const formsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});
const forms = mongoose.model("forms", formsSchema);
module.exports = { forms };
