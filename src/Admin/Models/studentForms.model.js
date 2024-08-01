const mongoose = require("mongoose");

const studentFormsSchema = mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
  },
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
const studentForms = mongoose.model("studentForms", studentFormsSchema);
module.exports = { studentForms };
