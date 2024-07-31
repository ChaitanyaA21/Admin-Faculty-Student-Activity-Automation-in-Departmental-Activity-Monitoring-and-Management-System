const mongoose = require("mongoose");

const marksSchema = mongoose.Schema({
  internalNo: {
    type: Number,
    required: true,
  },
  marks: {
    type: Number,
    default: 0,
  },
  assignment: {
    type: Number,
    default: 0,
  },
  presentation: {
    type: Number,
    default: 0,
  },
});

const marksAndAttendanceSchema = mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    present: {
      type: [String],
    },
    absent: {
      type: [String],
    },
    internal: [marksSchema],
  },
  { timestamps: true }
);

const marksAndAttendanceModel = mongoose.model(
  "marksAndAttendance",
  marksAndAttendanceSchema
);
module.exports = { marksAndAttendanceModel };
