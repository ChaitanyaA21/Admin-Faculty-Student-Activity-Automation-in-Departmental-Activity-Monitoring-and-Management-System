const mongoose = require("mongoose");

const curricularActivitiesSchema = mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, "RollNo not provided"],
    },
    title: {
      type: String,
      required: [true, "Title not provided"],
    },
    message: {
      type: String,
      required: [true, "Message not provided"],
    },
    place: {
      type: String,
      required: [true, "Place not provided"],
    },
    certificateUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const curricularActivities = mongoose.model(
  "curricularactivities",
  curricularActivitiesSchema
);
module.exports = { curricularActivities };
