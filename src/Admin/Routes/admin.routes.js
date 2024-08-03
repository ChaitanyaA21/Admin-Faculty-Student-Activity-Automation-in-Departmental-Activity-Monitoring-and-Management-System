const express = require("express");
const router = express.Router();
const { verifyJWTAdmin } = require("../Middleware/auth.middleware.js");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
} = require("../Controllers/adminRegNdLogin.controller.js");
const {
  viewNotifications,
  createNotification,
  deleteNotification,
  readNotification,
  viewSentNotifications,
} = require("../Controllers/notification.controller.js");

router.route("/adminregistration").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/notifications").get(viewNotifications);
router.route("/create-notifications/:type").post(createNotification);
router.route("/delete-notifications").delete(deleteNotification);
router.route("/set-read-notifications").patch(readNotification);
router.route("/sent-notifications").get(viewSentNotifications);
//Secure the routes

router.route("/logout").post(verifyJWTAdmin, logoutAdmin);
router.route("/refreshtoken").post(refreshAccessToken);

module.exports = router;
