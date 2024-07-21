const express = require("express");
const router = express.Router();

const {
  addSemester,
  deleteSemester,
  viewSemester,
  updateSemester,
} = require("../Controllers/semester.controller");

router.route("/addsemester").post(addSemester);
router.route("/deletesemester").delete(deleteSemester);
router.route("/viewsemester").get(viewSemester);
router.route("/updatesemester").patch(updateSemester);

module.exports = router;
