const express = require('express');
const {upload} = require('../Middleware/multer.middleware.js')
const router=express.Router()
const registerStudent=require('../Controllers/studentRegister.controller.js')


router.route("/registration").post(upload.single("file"),registerStudent)

module.exports = router;