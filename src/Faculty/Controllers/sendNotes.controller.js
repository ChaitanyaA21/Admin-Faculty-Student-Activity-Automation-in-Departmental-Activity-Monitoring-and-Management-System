const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { uploadOnCloudinary } = require("../../Admin/Utils/cloudinary.utils.js");
const SendNotes = require("../../Admin/Models/sendNotes.model.js");

const sendNotes = asyncHandler(async (req, res) => {
  // added academicYear so that the notes when viewed by student should only
  // his/her notes in the website
  const { subjectName, subjectId, academicYear, title } = req.body;
  const file = req.file.path;

  // Checking whether all the  required fields are present
  if (!subjectName || !subjectId || !title || !academicYear || !file) {
    throw new ApiError(
      400,
      "All fields are required: subjectName, subjectId, title, academic year, and file"
    );
  }

  // Upload file to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(file);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }
  // Create new SendNotes document
  const newNote = await SendNotes.create({
    subjectName,
    subjectId,
    title,
    academicYear,
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

const deleteNotes = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length == 0) {
    throw new ApiError(404, "Client Error: Correct details are not provided");
  }

  const result = await SendNotes.deleteMany({ _id: { $in: ids } });

  if (!result) {
    throw new ApiError(500, "Internal Server Error: Couldn't delete notes");
  }

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = { sendNotes, deleteNotes };
