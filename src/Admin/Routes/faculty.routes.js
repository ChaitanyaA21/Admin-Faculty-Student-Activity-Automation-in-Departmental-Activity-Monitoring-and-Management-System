const express = require("express");
const router = express.Router();
const { verifyJWTFaculty } = require("../Middleware/auth.middleware.js");
const {
  viewFaculty,
  deleteFaculty,
  updateFaculty,
} = require("../Controllers/viewFaculty.controller.js");

const { viewSubjects } = require("../Controllers/subject.controller.js");

const {
  registerFaculty,
  getSubjects,
  assignSubject,
  updateAssignedSubject,
} = require("../Controllers/facultyRegister.controller.js");
const {
  loginFaculty,
  logoutFaculty,
  refreshAccessToken,
} = require("../Controllers/facultyLogin.controller.js");

router.route("/registration").post(registerFaculty);
router.route("/login").post(loginFaculty);
router.route("/getsubjects").post(verifyJWTFaculty, getSubjects);
router.route("/assignsubject").patch(assignSubject);
router.route("/updateassignedsubject").patch(updateAssignedSubject);
//Secure the routes
router.route("/logout").post(verifyJWTFaculty, logoutFaculty);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/viewFaculty").get(viewFaculty);
router.route("/deleteFaculty").delete(deleteFaculty);
router.route("/updatefaculty").patch(updateFaculty);
router.route("/viewsubjects").post(viewSubjects);

module.exports = router;
