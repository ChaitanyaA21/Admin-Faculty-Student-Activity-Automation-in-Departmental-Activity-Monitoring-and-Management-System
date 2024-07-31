const mongoose = require("mongoose");

const internshipSchema = mongoose.Schema({
  rollNo: {
    type: String,
    required: [true, "rollNo is not provided"],
  },
  companyName: {
    type: String,
    required: [true, "CompanyName is not provided"],
  },
  Domain: {
    type: String,
    required: [true, "Domain is not provided"],
  },
  isActive: {
    type: Boolean,
    required: [true, "isActive status not provided"],
  },
  timeperiod: {
    type: Number,
    required: [true, "Timeperiod is not provided"],
  },
  certificateUrl: {
    type: String,
  },
});

const internship = mongoose.model("internshipdetails", internshipSchema);
module.exports = { internship };
