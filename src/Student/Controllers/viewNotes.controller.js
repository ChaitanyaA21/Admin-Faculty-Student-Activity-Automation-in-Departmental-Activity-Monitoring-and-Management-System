const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const SendNotes = require("../../Admin/Models/sendNotes.model.js");

const viewNotes = asyncHandler(async (req, res) => {
  const { subjectId, subjectName } = req.body;
  if (!subjectId || !subjectName) {
    throw new ApiError(404, "Client Error: Details not provided");
  }

  const result = await SendNotes.find({
    subjectId,
    subjectName,
    academicYear: req.userDetails?.academicYear,
  });

  if (!result) {
    return res.status(200).json(200, {}, "No Notes are available");
  }

  return res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = viewNotes;
