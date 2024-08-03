const mongoose = require("mongoose");

const sendNotesSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
    },
    subjectId: {
      type: String,
      required: [true, "Subject ID is required"],
    },
    academicYear: {
      type: Number,
      required: [true, "Academic Year is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
  },
  { timestamps: true }
);

const SendNotes = mongoose.model("SendNotes", sendNotesSchema);

module.exports = SendNotes;
