const express = require('express');
const router=express.Router()

//controllers

const {updateAttendance}=require("../Controllers/attendance.controller.js");
const {updateInternalMarks}=require("../Controllers/marks.controller.js");
const {checkProfile}=require("../Controllers/profile.controller.js")
const {updatePassword}=require("../Controllers/updatePassword.controller.js")
const {updateContact}=require("../Controllers/updateContact.controller.js")


router.route("/attendance").post(updateAttendance);
router.route("/internalmarks").post(updateInternalMarks);
router.route("/checkprofile").post(checkProfile);
router.route("/password").post(updatePassword);
router.route("/contact").post(updateContact);


module.exports = router;