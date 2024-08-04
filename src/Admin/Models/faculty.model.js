const mongoose = require("mongoose");

const facultySchema = mongoose.Schema(
  {
    facultyId: {
      type: String,
      uppercase: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    altEmail: {
      type: String,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    aadharNo: {
      type: Number,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    subjects: {
      type: Array,
    },
    profilePhotoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);
const facultyModel = mongoose.model("faculty", facultySchema);
module.exports = { facultyModel };
