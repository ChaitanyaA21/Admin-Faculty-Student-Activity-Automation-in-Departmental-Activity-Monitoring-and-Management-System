const express = require("express");
const router = express.Router();

const {
  addSubject,
  deleteSubjects,
  viewSubjects,
  updateSubject,
} = require("../Controllers/subject.controller.js");

router.route("/addsubject").post(addSubject);
router.route("/deletesubject").delete(deleteSubjects);
router.route("/viewsubject").get(viewSubjects);
router.route("/updatesubject").patch(updateSubject);

module.exports = router;
