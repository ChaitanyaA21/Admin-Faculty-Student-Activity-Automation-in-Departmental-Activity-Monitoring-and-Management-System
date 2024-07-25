const mongoose = require("mongoose");

const academicCalendarSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    uppercase: [true, "Branch Must be in uppercase"],
  },
  academicYear: {
    type: Number,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});
const academicCalendar = mongoose.model(
  "academicCalendar",
  academicCalendarSchema
);
module.exports = { academicCalendar };
