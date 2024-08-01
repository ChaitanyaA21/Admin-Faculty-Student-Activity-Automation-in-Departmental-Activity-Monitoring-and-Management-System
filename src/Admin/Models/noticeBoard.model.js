const mongoose = require("mongoose");

const noticeBoardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    uppercase: [true, "Branch Must be in uppercase"],
  },
  academicYear: {
    type: Number,
  },
  public_id: {
    type: String,
    required: true,
  },
});
const noticeBoard = mongoose.model("noticeBoard", noticeBoardSchema);
module.exports = { noticeBoard };
