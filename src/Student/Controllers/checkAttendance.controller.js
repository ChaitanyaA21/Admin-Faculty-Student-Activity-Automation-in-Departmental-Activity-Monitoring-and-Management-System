const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const checkAttendance = asyncHandler(async (req, res) => {
  const { subjectName } = req.body;

  const attendance = await marksAndAttendanceModel.findOne(
    {
      rollNo: req.user?.rollNo,
      subjectName,
    },
    {
      present: 1,
      absent: 1,
      subjectName: 1,
    }
  );
  if (!attendance) {
    return res.status(201).json(new ApiResponse(201, {}, "No results found"));
  }

  res.status(200).json(new ApiResponse(200, attendance, "Successfull"));
});

module.exports = { checkAttendance };
