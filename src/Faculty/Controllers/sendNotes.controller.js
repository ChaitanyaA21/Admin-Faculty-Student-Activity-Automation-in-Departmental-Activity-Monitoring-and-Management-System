const { asyncHandler } = require("../utils/asyncHandler.utils");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const SendNotes = require("../models/SendNotes");

const sendNotes = asyncHandler(async (req, res) => {
  const { subjectName, subjectId, title } = req.body;
  const file = req.files?.file;

  // Check if all required fields are present
  if (!subjectName || !subjectId || !title || !file) {
    throw new ApiError(
      400,
      "All fields are required: subjectName, subjectId, title, and file"
    );
  }

  // Upload file to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(file.path);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }

  // Create new SendNotes document
  const newNote = await SendNotes.create({
    subjectName,
    subjectId,
    title,
    fileUrl: cloudinaryResponse.url,
  });

  // Send response
  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: newNote.fileUrl,
        title: newNote.title,
      },
      "Note uploaded successfully"
    )
  );
});

module.exports = { sendNotes };
