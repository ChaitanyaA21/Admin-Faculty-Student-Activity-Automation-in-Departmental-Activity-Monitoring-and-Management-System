const { facultyLogin } = require("../../Admin/Models/facultyLogin.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await facultyLogin.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist with this roll no");
  }

  const isPasswordValid = await student.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password is incorrect");
  }

  user.password = newPassword;
  const result = await user.save({ validateBeforeSave: false });

  if (!result) {
    throw new ApiError(500, "Internal Server Error while updating password");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully updated password"));
});

module.exports = { updatePassword };
