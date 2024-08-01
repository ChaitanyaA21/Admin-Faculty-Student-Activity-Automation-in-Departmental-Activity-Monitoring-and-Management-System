// Middleware function with file name auth.middleware.js
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { studentLogin } = require("../Models/studentLogin.model.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../Models/adminDetails.model.js");
const { studentModel } = require("../Models/student.model.js");
const { facultyModel } = require("../Models/faculty.model.js");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await studentLogin
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!student) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const studentDetails = await studentModel.findOne({
      rollNo: decodedToken?.rollNo,
    });
    req.userDetails = studentDetails;
    req.user = student;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const verifyJWTFaculty = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await facultyLogin
    .findById(decodedToken?._id)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  const facultyDetails = await facultyModel.findOne({
    facultyId: decodedToken?.facultyId,
  });
  req.userDetails = facultyDetails;
  req.user = user;
  next();
});
const verifyJWTAdmin = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const adminLogin = await adminModel
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!adminLogin) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = adminLogin;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
module.exports = { verifyJWT, verifyJWTFaculty, verifyJWTAdmin };
