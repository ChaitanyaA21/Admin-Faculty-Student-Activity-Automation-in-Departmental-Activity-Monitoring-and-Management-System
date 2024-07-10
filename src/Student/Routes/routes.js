const express = require('express');
const router=express.Router()

// controllers

const {updatePassword} = require("../Controllers/updatePassword.controller.js")


// routes

router.route("/password").post(updatePassword)

module.exports  = router;