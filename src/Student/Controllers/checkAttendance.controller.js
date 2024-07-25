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
      attendance: 1,
    }
  );

  if (!attendance) {
    throw new ApiError(404, "Student details not found");
  }

  res.status(200).json(new ApiResponse(200, attendance, "Successfull"));
});

module.exports = { checkAttendance };
