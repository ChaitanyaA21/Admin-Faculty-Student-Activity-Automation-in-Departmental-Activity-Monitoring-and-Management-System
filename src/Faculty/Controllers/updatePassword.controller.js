const { facultyLogin } = require("../../Admin/Models/facultyLogin.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const faculty = await facultyLogin.findOne({ facultyId: req.user.facultyId });

  if (!faculty) {
    throw new ApiError(404, "faculty does not exist with this faculty Id");
  }

  const isPasswordValid = await faculty.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password is incorrect");
  }

  faculty.password = newPassword;
  const result = await faculty.save({ validateBeforeSave: false });

  if (!result) {
    throw new ApiError(500, "Internal Server Error while updating password");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        msg: "Successfull",
      },
      "Successfully updated password"
    )
  );
});

module.exports = { updatePassword };
