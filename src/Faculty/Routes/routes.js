const express = require("express");
const router = express.Router();
const { upload } = require("../../Admin/Middleware/multer.middleware.js");

//controllers

const { addAttendance } = require("../Controllers/attendance.controller.js");
const { updateInternalMarks } = require("../Controllers/marks.controller.js");
const { checkProfile } = require("../Controllers/profile.controller.js");
const {
  updatePassword,
} = require("../Controllers/updatePassword.controller.js");
const { updateContact } = require("../Controllers/updateContact.controller.js");
const {
  sendNotes,
  deleteNotes,
} = require("../Controllers/sendNotes.controller.js");

const {
  addMyActivity,
  viewActivity,
  deleteActivity,
} = require("../../Student/Controllers/addMyActivity.controller.js");
const {
  createNotification,
  deleteNotification,
  viewNotifications,
  readNotification,
  viewSentNotifications,
} = require("../../Admin/Controllers/notification.controller.js");
const {
  uploadProfilePhoto,
  getProfilePhoto,
} = require("../../Admin/Controllers/viewProfilePhoto.controller.js");
const {
  createLessonPlan,
  getAllLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan,
} = require("../Controllers/lessonPlan.controller.js");

const {
  viewNotes,
} = require("../../Student/Controllers/viewNotes.controller.js");

router.route("/attendance").post(addAttendance);
router.route("/internalmarks").post(updateInternalMarks);
router.route("/checkprofile").get(checkProfile);
router.route("/password").patch(updatePassword);
router.route("/contact").patch(updateContact);
router.route("/sendnotes").post(upload.single("file"), sendNotes);

router.route("/lessonplan").post(createLessonPlan);
router
  .route("/lessonplan/:id")
  .get(getLessonPlanById)
  .put(updateLessonPlan)
  .delete(deleteLessonPlan);

router.route("/get-lesson-plans").post(getAllLessonPlans);
router.route("/update-lesson-plans").patch(updateLessonPlan);
router.route("/delete-lesson-plans").delete(deleteLessonPlan);

router.route("/add-activity/:type").post(upload.single("file"), addMyActivity);
router.route("/view-activity/:type").get(viewActivity);
router.route("/delete-activity/:type").delete(deleteActivity);
router.route("/viewnotes").post(viewNotes);
router.route("/deletenotes").delete(deleteNotes);

router.route("/sendnotes").post(upload.single("file"), sendNotes);
router.route("/notifications").get(viewNotifications);
router.route("/create-notifications/:type").post(createNotification);
router.route("/delete-notifications").delete(deleteNotification);
router.route("/set-read-notification").patch(readNotification);
router.route("/sent-notifications").get(viewSentNotifications);

router
  .route("/upload-profile-photo")
  .post(upload.single("file"), uploadProfilePhoto);
router.route("/view-profile-photo").post(getProfilePhoto);
module.exports = router;
