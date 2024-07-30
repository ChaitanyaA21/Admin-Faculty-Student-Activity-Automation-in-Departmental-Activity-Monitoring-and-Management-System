const { facultyModel } = require("../Models/faculty.model.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils");
const { ApiError } = require("../Utils/ApiError.utils");
const { ApiResponse } = require("../Utils/ApiResponse.utils");

// View all faculty details
const viewFaculty = asyncHandler(async (req, res) => {
  const faculties = await facultyModel.find({});
  if (!faculties) {
    throw new ApiError(404, "No faculty found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Faculties retrieved successfully", faculties));
});

const deleteFaculty = asyncHandler(async (req, res) => {
  const { facultyIds } = req.body;
  console.log(req.body);

  if (!Array.isArray(facultyIds) || facultyIds.length === 0) {
    throw new ApiError(400, "Invalid faculty IDs array");
  }

  const result = await facultyModel.deleteMany({
    facultyId: { $in: facultyIds },
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No faculties found to delete");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Faculties deleted successfully", result));
});

module.exports = { viewFaculty, deleteFaculty };
