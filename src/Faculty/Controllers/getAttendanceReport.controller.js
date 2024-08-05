const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

const getAttendanceReport = asyncHandler(async (req, res) => {
  const { rollNos, subjectName } = req.body;

  if ((!Array.isArray(rollNos) && !rollNos.length) || !subjectName) {
    throw new ApiError(404, "Client Error: Details not given");
  }

  const result = await marksAndAttendanceModel
    .find(
      {
        subjectName,
        rollNo: { $in: rollNos },
      },
      { attendance: 1, rollNo: 1, _id: 0 }
    )
    .sort({ rollNo: 1 });

  if (!result) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Attendance Found"));
  }

  return res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = { getAttendanceReport };
