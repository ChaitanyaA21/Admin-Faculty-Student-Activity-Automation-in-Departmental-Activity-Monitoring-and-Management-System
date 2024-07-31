const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is not given"],
    },
    message: {
      type: String,
      required: [true, "Project message is not given"],
    },
    // guide is nothing but faculty id
    guide: {
      type: String,
      required: [true, "Project guide is not given"],
    },
  },
  { timestamps: true }
);

const project = mongoose.model("project", projectSchema);
module.exports = { project };
