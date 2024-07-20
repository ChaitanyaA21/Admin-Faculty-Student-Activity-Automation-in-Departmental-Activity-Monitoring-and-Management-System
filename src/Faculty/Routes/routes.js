const express = require('express');
const router=express.Router()

// controllers

const {updateAttendance}=require("../Controllers/attendance.controller.js");
const {updateInternalMarks}=require("../Controllers/marks.controller.js");

// routes
router.route("/attendance").post(updateAttendance);
router.route("/internalmarks").post(updateInternalMarks);


module.exports = router;