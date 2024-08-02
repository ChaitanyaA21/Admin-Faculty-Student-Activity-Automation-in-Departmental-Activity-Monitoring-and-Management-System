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
  academicYear: {
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
  facultyId: {
    type: String,
  },
});

const subject = mongoose.model("subject", subjectSchema);
module.exports = { subject };
