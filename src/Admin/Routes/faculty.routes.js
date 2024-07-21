const express = require("express");
const router = express.Router();
const { verifyJWTFaculty } = require("../Middleware/auth.middleware.js");
const {
  registerFaculty,
} = require("../Controllers/facultyRegister.controller.js");
const {
  loginFaculty,
  logoutFaculty,
  refreshAccessToken,
} = require("../Controllers/facultyLogin.controller.js");

router.route("/registration").post(registerFaculty);
router.route("/login").post(loginFaculty);
//Secure the routes
router.route("/logout").post(verifyJWTFaculty, logoutFaculty);
router.route("/refreshtoken").post(refreshAccessToken);

module.exports = router;
