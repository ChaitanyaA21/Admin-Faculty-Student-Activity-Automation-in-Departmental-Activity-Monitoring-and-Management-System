const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const checkInternalMarks = asyncHandler(async (req, res) => {
  const { subjectName } = req.body;

  const student = await marksAndAttendanceModel.findOne(
    { rollNo: req.user?.rollNo, subjectName },
    { internal: 1 }
  );

  if (!student) {
    return res.status(201).json(new ApiResponse(201, {}, "No results found"));
  }

  return res.status(200).json(new ApiResponse(200, student, "Successfull"));
});

module.exports = { checkInternalMarks };
