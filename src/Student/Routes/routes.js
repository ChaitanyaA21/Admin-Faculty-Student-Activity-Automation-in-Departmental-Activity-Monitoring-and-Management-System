const express = require("express");
const router = express.Router();

// controllers

const {
  updatePassword,
} = require("../Controllers/updatePassword.controller.js");
const {
  checkAttendance,
} = require("../Controllers/checkAttendance.controller.js");
const { updateContact } = require("../Controllers/updateContact.controller.js");
const {
  checkInternalMarks,
} = require("../Controllers/checkInternalMarks.controller.js");
const { checkProfile } = require("../Controllers/checkProfile.controller.js");
const { viewFiles } = require("../Controllers/viewFiles.controller.js");
const {
  getSubjects,
} = require("../../Admin/Controllers/facultyRegister.controller.js");
const { addMyActivity } = require("../Controllers/addMyActivity.controller.js");
const { getClassmates } = require("../Controllers/getClassmates.controller.js");

// routes

router.route("/password").patch(updatePassword);
router.route("/attendance").post(checkAttendance);
router.route("/updatecontact").patch(updateContact);
router.route("/internalmarks").post(checkInternalMarks);
router.route("/profile").get(checkProfile);
router.route("/viewfiles/:type").get(viewFiles);
router.route("/getsubjects").post(getSubjects);
router.route("/add-activity/:type").post(addMyActivity);
router.route("/getclassmates").get(getClassmates);

module.exports = router;
