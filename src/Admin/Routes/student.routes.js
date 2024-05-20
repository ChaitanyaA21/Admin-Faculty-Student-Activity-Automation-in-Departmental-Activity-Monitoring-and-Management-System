const express = require('express');
// const app=express();
const router=express.Router()
const registerStudent=require('../Controllers/studentRegister.controller.js')


router.route("/registration").post(registerStudent)

module.exports = router;