const express = require("express");
const router = express.Router();
const { upload } = require("../../Admin/Middleware/multer.middleware.js");

// controllers

const {
  updatePassword,
} = require("../Controllers/updatePassword.controller.js");
const {
  checkAttendance,
} = require("../Controllers/checkAttendance.controller.js");
const { updateContact } = require("../Controllers/updateContact.controller.js");
const {
  checkInternalMarks,
} = require("../Controllers/checkInternalMarks.controller.js");
const { checkProfile } = require("../Controllers/checkProfile.controller.js");
const { viewFiles } = require("../Controllers/viewFiles.controller.js");
const {
  getSubjects,
} = require("../../Admin/Controllers/facultyRegister.controller.js");
const {
  addMyActivity,
  viewActivity,
  deleteActivity,
} = require("../Controllers/addMyActivity.controller.js");
const { getClassmates } = require("../Controllers/getClassmates.controller.js");
const {
  createNotification,
  deleteNotification,
  viewNotifications,
  readNotification,
  viewSentNotifications,
} = require("../../Admin/Controllers/notification.controller.js");
const {
  viewFaculty,
} = require("../../Admin/Controllers/viewFaculty.controller.js");

const {
  uploadProfilePhoto,
  getProfilePhoto,
} = require("../../Admin/Controllers/viewProfilePhoto.controller.js");

// routes

router.route("/password").patch(updatePassword);
router.route("/attendance").post(checkAttendance);
router.route("/updatecontact").patch(updateContact);
router.route("/internalmarks").post(checkInternalMarks);
router.route("/profile").get(checkProfile);

router.route("/viewfiles/:type").get(viewFiles);

router.route("/getsubjects").post(getSubjects);
router.route("/viewFaculty").get(viewFaculty);

router.route("/add-activity/:type").post(upload.single("file"), addMyActivity);
router.route("/view-activity/:type").get(viewActivity);
router.route("/delete-activity/:type").delete(deleteActivity);

router.route("/getclassmates").get(getClassmates);

router.route("/notifications").get(viewNotifications);
router.route("/create-notifications/:type").post(createNotification);
router.route("/delete-notifications").delete(deleteNotification);
router.route("/set-read-notifications").patch(readNotification);
router.route("/sent-notifications").get(viewSentNotifications);

router
  .route("/upload-profile-photo")
  .post(upload.single("file"), uploadProfilePhoto);
router.route("/view-profile-photo").post(getProfilePhoto);
module.exports = router;
