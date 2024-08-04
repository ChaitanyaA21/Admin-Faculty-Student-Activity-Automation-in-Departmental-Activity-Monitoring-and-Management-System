const mongoose = require("mongoose");

const lessonPlanSchema = new mongoose.Schema(
  {
    // facultyId: {
    //   type: String,
    //   required: [true, "Faculty Id is required"],
    // },
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
    academicYear: {
      type: Number,
      required: [true, "AcademicYear is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

const LessonPlan = mongoose.model("LessonPlan", lessonPlanSchema);

module.exports = { LessonPlan };
