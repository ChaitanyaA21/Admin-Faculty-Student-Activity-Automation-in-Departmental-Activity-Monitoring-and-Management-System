const mongoose = require("mongoose");

// const subjectSchema = mongoose.Schema({
//   subjectId: {
//     type: String,
//     required: true,
//   },
//   subjectName: {
//     type: String,
//     required: true,
//   },
//   department: {
//     type: String,
//     required: true,
//   },
// });

const subjectSchema = mongoose.Schema({
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
  subjectId: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
});

const subject = mongoose.model("subject", subjectSchema);
module.exports = { subject };
