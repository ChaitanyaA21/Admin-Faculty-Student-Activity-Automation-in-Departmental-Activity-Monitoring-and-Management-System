const express = require("express");
const router = express.Router();
const { uploadFile } = require("../Controllers/fileUploads.controller.js");
const { upload } = require("../Middleware/multer.middleware.js");
const fs = require("fs");

router.post("/notice", upload.single("file"), uploadFile);
router.post("/studentform", upload.single("file"), uploadFile);
router.post("/academicalendar", upload.single("file"), uploadFile);

module.exports = router;
