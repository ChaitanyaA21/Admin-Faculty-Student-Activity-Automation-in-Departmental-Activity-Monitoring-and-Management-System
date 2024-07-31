const express = require("express");
const router = express.Router();
const { verifyJWTAdmin } = require("../Middleware/auth.middleware.js");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
} = require("../Controllers/adminRegNdLogin.controller.js");

router.route("/adminregistration").post(registerAdmin);
router.route("/login").post(loginAdmin);
//Secure the routes

router.route("/logout").post(verifyJWTAdmin, logoutAdmin);
router.route("/refreshtoken").post(refreshAccessToken);

module.exports = router;
