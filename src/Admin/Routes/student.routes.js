const express = require("express");
const router = express.Router();
const { upload } = require("../Middleware/multer.middleware.js");
const { verifyJWT } = require("../Middleware/auth.middleware.js");
const registerStudent = require("../Controllers/studentRegister.controller.js");
const {
  loginStudent,
  logoutStudent,
  refreshAccessToken,
} = require("../Controllers/loginStudent.controller.js");

router.route("/registration").post(upload.single("file"), registerStudent);
router.route("/login").post(loginStudent);
//Secure the routes
router.route("/logout").get(verifyJWT, logoutStudent);

// Below route has to be hit by frontend whenever the accesstoken
// expires so that using refresh token new access token can be generated.
router.route("/refreshtoken").post(refreshAccessToken);

module.exports = router;
