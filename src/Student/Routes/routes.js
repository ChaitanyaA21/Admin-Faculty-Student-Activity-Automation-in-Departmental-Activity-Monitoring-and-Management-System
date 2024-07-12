const express = require('express');
const router=express.Router()

// controllers

const {updatePassword} = require("../Controllers/updatePassword.controller.js")
const {checkAttendance} = require("../Controllers/checkAttendance.controller.js");
const { updateContact } = require('../Controllers/updateContact.controller.js');


// routes

router.route("/password").post(updatePassword)
router.route("/attendance").post(checkAttendance)
router.route("/updatecontact").post(updateContact)


module.exports  = router;