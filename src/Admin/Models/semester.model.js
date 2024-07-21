const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
  },
  year: {
    type: Number,
    required: true,
  },
  semNo: {
    type: Number,
    required: true,
  },
  subjects: {
    type: Array,
    required: true,
  },
});
const semester = mongoose.model("semester", semesterSchema);
module.exports = { semester };
