const { studentLogin } = require("../Models/studentLogin.model.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../Utils/ApiResponse.utils");

const resetPassword = asyncHandler(async (req, res) => {
  const { usertype, token } = req.query;
  const { newPassword } = req.body;

  if (!token) {
    throw new ApiError(404, "Wrong url link try reseting again");
  }

  const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

  let loginDocument;
  if (usertype === "student") {
    loginDocument = await studentLogin.findById(decodedToken?._id);
  } else if (usertype === "faculty") {
    loginDocument = await facultyLogin.findById(decodedToken?._id);
  } else {
    throw new ApiError(404, "Wrong url link try reseting again");
  }

  if (loginDocument) {
    loginDocument.password = newPassword;
    loginDocument.resetToken = "";
    loginDocument.save({ validateBeforeSave: false });
  } else {
    throw new ApiError(500, "Invalid or expired token");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password resetted successfully, login again",
        "Successful"
      )
    );
});

module.exports = { resetPassword };
