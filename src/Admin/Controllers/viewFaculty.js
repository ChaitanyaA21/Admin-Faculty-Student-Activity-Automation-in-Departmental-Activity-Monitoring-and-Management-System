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
const updateFaculty = asyncHandler(async (req, res) => {
  const { facultyId, ...updateFields } = req.body;

  if (!facultyId) {
    throw new ApiError(400, "Faculty ID is required");
  }

  Object.keys(updateFields).forEach(
    (key) => updateFields[key] === undefined && delete updateFields[key]
  );

  const updatedFaculty = await facultyModel.findOneAndUpdate(
    { facultyId: facultyId },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedFaculty) {
    throw new ApiError(404, "Faculty not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Faculty updated successfully", updatedFaculty));
});

const deleteFaculty = asyncHandler(async (req, res) => {
  const { facultyIds } = req.body;

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

module.exports = { viewFaculty, deleteFaculty, updateFaculty };
