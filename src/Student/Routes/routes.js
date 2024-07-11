const express = require('express');
const router=express.Router()

// controllers

const {updatePassword} = require("../Controllers/updatePassword.controller.js")
const {checkAttendance} = require("../Controllers/checkAttendance.controller.js")


// routes

router.route("/password").post(updatePassword)
router.route("/attendance").post(checkAttendance)

module.exports  = router;