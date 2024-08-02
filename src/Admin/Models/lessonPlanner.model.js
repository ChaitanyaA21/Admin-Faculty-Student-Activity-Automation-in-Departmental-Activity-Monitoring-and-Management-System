const mongoose = require("mongoose");

const lessonPlanSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
    },
    subjectId: {
      type: String,
      required: [true, "Subject ID is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    date: {
      type: Date, // Changed from lowercase 'date' to 'Date'
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

const LessonPlan = mongoose.model("LessonPlan", lessonPlanSchema);

module.exports = LessonPlan;
