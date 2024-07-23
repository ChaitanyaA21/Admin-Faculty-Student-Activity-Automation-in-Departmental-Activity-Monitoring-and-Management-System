const express = require("express");
const router = express.Router();
const { resetPassword } = require("../Controllers/resetPassword.controller.js");
const {
  forgotPassword,
} = require("../Middleware/forgotPassword.middleware.js");

router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetPassword);

module.exports = router;
