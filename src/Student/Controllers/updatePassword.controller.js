const { studentLogin } = require("../../Admin/Models/studentLogin.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const student = await studentLogin.findById(req.user._id);

  if (!student) {
    throw new ApiError(404, "Student does not exist with this roll no");
  }

  const isPasswordValid = await student.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password is incorrect");
  }

  student.password = newPassword;
  const result = await student.save({ validateBeforeSave: false });

  if (!result) {
    throw new ApiError(500, "Internal Server Error while updating password");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully updated password"));
});

module.exports = { updatePassword };
