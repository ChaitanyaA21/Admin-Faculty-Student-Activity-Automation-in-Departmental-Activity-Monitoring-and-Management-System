const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");

const { uploadOnCloudinary } = require("../Utils/cloudinary.utils.js");
const fs = require("fs").promises;
const { studentModel } = require("../Models/student.model.js");
const { facultyModel } = require("../Models/faculty.model.js");

const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const userType = req.body.userType;
  let userId = "";
  if (userType === "student") {
    userId = req.user.rollNo;
  } else if (userType === "faculty") {
    userId = req.user.facultyId;
  }
  const photoFile = req.file;

  if (!userType || !["student", "faculty"].includes(userType)) {
    throw new ApiError(400, "Invalid user type");
  }

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  if (!photoFile) {
    throw new ApiError(400, "Profile photo file is required");
  }

  let userModel,
    query = {};
  if (userType === "student") {
    userModel = studentModel;
    query = { rollNo: userId };
  } else {
    userModel = facultyModel;
    query = { facultyId: userId };
  }

  const userData = await userModel.find(query);
  if (!userData) {
    throw new ApiError(404, `${userType} details not found`);
  }

  // Upload photo to Cloudinary
  const cloudinaryResult = await uploadOnCloudinary(photoFile.path);
  if (!cloudinaryResult || !cloudinaryResult.url) {
    throw new ApiError(500, "Failed to upload profile photo to Cloudinary");
  }

  // Update user model with profile photo URL
  const result = await userModel.findOneAndUpdate(
    query,
    {
      profilePhotoUrl: cloudinaryResult.url,
    },
    {
      new: true,
    }
  );

  // Delete the temporary file
  await fs.unlink(photoFile.path);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile photo uploaded successfully"));
});

const getProfilePhoto = asyncHandler(async (req, res) => {
  const { userType } = req.body;
  let userId;
  if (userType === "student") {
    userId = req.user?.rollNo;
  } else if (userType === "faculty") {
    userId = req.user?.facultyId;
  }

  if (!userType || !["student", "faculty"].includes(userType)) {
    throw new ApiError(400, "Invalid user type");
  }

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  let userModel,
    query = {};
  if (userType === "student") {
    userModel = studentModel;
    query = { rollNo: userId };
  } else {
    userModel = facultyModel;
    query = { facultyId: userId };
  }

  const userData = await userModel.findOne(query);

  if (!userData) {
    throw new ApiError(404, `${userType} details not found`);
  }

  if (!userData.profilePhotoUrl) {
    return new ApiResponse(201, {}, "Profile photo not Updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profilePhotoUrl: userData.profilePhotoUrl },
        "Profile photo URL retrieved successfully"
      )
    );
});

module.exports = { uploadProfilePhoto, getProfilePhoto };
