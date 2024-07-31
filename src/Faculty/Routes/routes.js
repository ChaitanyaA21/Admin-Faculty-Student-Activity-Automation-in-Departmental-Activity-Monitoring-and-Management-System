const express = require("express");
const router = express.Router();

//controllers

const { updateAttendance } = require("../Controllers/attendance.controller.js");
const { updateInternalMarks } = require("../Controllers/marks.controller.js");
const { checkProfile } = require("../Controllers/profile.controller.js");
const {
  updatePassword,
} = require("../Controllers/updatePassword.controller.js");
const { updateContact } = require("../Controllers/updateContact.controller.js");
const { sendNotes } = require("../Controllers/sendNotes.controller.js");

router.route("/attendance").post(updateAttendance);
router.route("/internalmarks").post(updateInternalMarks);
router.route("/checkprofile").get(checkProfile);
router.route("/password").patch(updatePassword);
router.route("/contact").patch(updateContact);
router.route("/sendnotes").post(upload.single("file"), sendNotes);
module.exports = router;
