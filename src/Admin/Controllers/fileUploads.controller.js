const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { uploadOnCloudinary } = require("../Utils/cloudinary.utils.js");
const fs = require("fs");

const uploadFile = asyncHandler(async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await uploadOnCloudinary(filePath);
    if (!result) {
      throw new ApiError(500, "Failed to upload file to Cloudinary");
    }
    return res.json(
      new ApiResponse(200, { url: result.url }, "File uploaded successfully")
    );
  } catch (error) {
    fs.unlinkSync(req.file.path);
    throw new ApiError(
      500,
      error.message || "Something went wrong while uploading the file"
    );
  }
});

module.exports = {
  uploadFile,
};
