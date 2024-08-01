const express = require("express");
const router = express.Router();
const {
  uploadFile,
  viewFile,
  deleteFile,
} = require("../Controllers/fileUploads.controller.js");
const { upload } = require("../Middleware/multer.middleware.js");
const fs = require("fs");
router.post("/upload/:type", upload.single("file"), uploadFile);
router.get("/view", viewFile);
router.delete("/delete", deleteFile);
module.exports = router;
