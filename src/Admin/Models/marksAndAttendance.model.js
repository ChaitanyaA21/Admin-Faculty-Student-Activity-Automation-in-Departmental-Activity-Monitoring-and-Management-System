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
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true,
        },
      },
    ],
    // absent: {
    //   type: [String],
    // },
    internal: [marksSchema],
  },
  { timestamps: true }
);

marksAndAttendanceSchema.pre("save", function (next) {
  const attendanceDates = this.attendance.map((att) => att.date.toISOString());
  const uniqueDates = new Set(attendanceDates);

  if (attendanceDates.length !== uniqueDates.size) {
    return next(new Error("Duplicate dates found in attendance."));
  }

  next();
});

const marksAndAttendanceModel = mongoose.model(
  "marksAndAttendance",
  marksAndAttendanceSchema
);
module.exports = { marksAndAttendanceModel };
