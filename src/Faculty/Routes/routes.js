const express = require("express");
const router = express.Router();
const { upload } = require("../../Admin/Middleware/multer.middleware.js");

//controllers

const { updateAttendance } = require("../Controllers/attendance.controller.js");
const { updateInternalMarks } = require("../Controllers/marks.controller.js");
const { checkProfile } = require("../Controllers/profile.controller.js");
const {
  updatePassword,
} = require("../Controllers/updatePassword.controller.js");
const { updateContact } = require("../Controllers/updateContact.controller.js");
const { sendNotes } = require("../Controllers/sendNotes.controller.js");
const { createLessonPlan } = require("../Controllers/lessonPlan.controller.js");
const {
  createNotification,
  deleteNotification,
  viewNotifications,
  readNotification,
} = require("../../Admin/Controllers/notification.controller.js");
const {
  createLessonPlan,
  getAllLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan,
} = require("../Controllers/lessonPlan.controller.js");

router.route("/attendance").post(updateAttendance);
router.route("/internalmarks").post(updateInternalMarks);
router.route("/checkprofile").get(checkProfile);
router.route("/password").patch(updatePassword);
router.route("/contact").patch(updateContact);
router.route("/sendnotes").post(sendNotes);

router.route("/lessonplan").post(createLessonPlan).get(getAllLessonPlans);
router
  .route("/lessonplan/:id")
  .get(getLessonPlanById)
  .put(updateLessonPlan)
  .delete(deleteLessonPlan);

router.route("/sendnotes").post(upload.single("file"), sendNotes);
router.route("/notifications").get(viewNotifications);
router.route("/create-notifications/:type").post(createNotification);
router.route("/delete-notifications").delete(deleteNotification);
router.route("/set-read-notification").patch(readNotification);
module.exports = router;
