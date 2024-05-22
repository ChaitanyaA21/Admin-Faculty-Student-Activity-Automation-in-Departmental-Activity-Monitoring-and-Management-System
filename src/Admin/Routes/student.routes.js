const express = require('express');
const router=express.Router()
const {upload} = require('../Middleware/multer.middleware.js')
const verifyJWT= require('../Middleware/auth.middleware.js')
const registerStudent=require('../Controllers/studentRegister.controller.js')
const  {loginStudent,logoutStudent,refresAccessToken}=require('../Controllers/loginStudent.controller.js')



router.route("/registration").post(upload.single("file"),registerStudent)
router.route("/login").post(loginStudent)
//Secure the routes 
router.route("/logout").post(verifyJWT,logoutStudent)
router.route("/refreshtoken").post(refresAccessToken)

module.exports = router;