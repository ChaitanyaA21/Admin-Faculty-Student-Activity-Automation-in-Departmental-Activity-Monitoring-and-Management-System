const { studentModel } = require("../../Admin/Models/student.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const checkProfile = asyncHandler(async (req, res) => {
  const student = await studentModel
    .findOne({ rollNo: req.user?.rollNo })
    .select("-semNumber");

  if (!student) {
    throw new ApiError(400, "Student details not found");
  }

  res.status(200).json(new ApiResponse(200, student, "Successfull"));
});

module.exports = { checkProfile };
