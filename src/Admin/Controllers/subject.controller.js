const { subject } = require("../Models/subject.model.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
//add subjects
const addSubject = asyncHandler(async (req, res) => {
  const {
    branch,
    specialization,
    academicYear,
    semNo,
    subjectId,
    subjectName,
  } = req.body;

  if (!branch || !academicYear || !semNo || !subjectId || !subjectName) {
    throw new ApiError(400, "Some details are missing");
  }

  let data = { branch, academicYear, semNo, subjectId, subjectName };

  if (specialization) {
    data.specialization = specialization;
  }

  const newSubject = new subject(data);

  await newSubject.save();

  res.status(201).json(new ApiResponse(200, newSubject, "Successful"));
});

//delete Subjects
const deleteSubjects = asyncHandler(async (req, res) => {
  const { subjectIds } = req.body;

  if (!subjectIds || !Array.isArray(subjectIds)) {
    throw new ApiError(404, "Details are not given");
  }

  const result = await subject.deleteMany({
    subjectId: { $in: subjectIds },
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No subjects found to delete");
  }

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

//View subjects

const viewSubjects = asyncHandler(async (req, res) => {
  let { branch, specialization, academicYear, semNo } = req.body;

  academicYear = Number(academicYear);
  semNo = Number(semNo);
  let data = { branch, academicYear, semNo };

  if (specialization) {
    data.specialization = specialization;
  }

  // Add condition to find subjects with empty facultyId
  data.facultyId = { $in: [null, ""] };

  const subjects = await subject.find(data, { _id: 0 });

  if (subjects.length === 0) {
    throw new ApiError(
      404,
      "No unassigned subjects found for the given details"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subjects,
        "Successfully retrieved unassigned subjects"
      )
    );
});

//Update Subject

const updateSubject = asyncHandler(async (req, res) => {
  const { oldSubjectId, updatedData } = req.body;

  if (!updatedData) {
    throw new ApiError(404, "Update details not given");
  }

  const updatedSubject = await subject
    .findOneAndUpdate(
      { subjectId: oldSubjectId },
      { $set: updatedData },
      { new: true }
    )
    .select("-_id -__v");

  if (!updatedSubject) {
    throw new ApiError(404, "Subject not found");
  }

  res.status(200).json(new ApiResponse(200, updatedSubject, "Subject updated"));
});

module.exports = { addSubject, deleteSubjects, viewSubjects, updateSubject };
