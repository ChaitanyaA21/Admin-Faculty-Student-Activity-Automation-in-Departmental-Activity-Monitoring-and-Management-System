const { studentModel } = require("../Models/student.model.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");

const viewStudents = async (req, res) => {
  const { branch, academicYear, specialization } = req.body;

  try {
    let query = {
      branch: branch.toUpperCase(),
      academicYear: parseInt(academicYear),
    };

    if (branch.toUpperCase() === "MTECH" && specialization) {
      query.specialization = specialization;
    }

    const students = await studentModel.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { rollNo, ...updateFields } = req.body;

  if (!rollNo) {
    throw new ApiError(400, "Roll Number is required");
  }

  // Remove undefined fields
  Object.keys(updateFields).forEach(
    (key) => updateFields[key] === undefined && delete updateFields[key]
  );

  // Convert dateOfBirth to Date object if it exists
  if (updateFields.dateOfBirth) {
    updateFields.dateOfBirth = new Date(updateFields.dateOfBirth);
  }

  const updatedStudent = await studentModel.findOneAndUpdate(
    { rollNo: rollNo },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Student updated successfully", updatedStudent));
};

// Delete students based on rollNos provided in the array from frontend
const deleteStudents = async (req, res) => {
  const { rollNos } = req.body;

  if (!Array.isArray(rollNos) || rollNos.length === 0) {
    return res.status(400).json({ message: "Invalid roll numbers array" });
  }

  try {
    await studentModel.deleteMany({ rollNo: { $in: rollNos } });
    res.status(200).json({ message: "Students deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { viewStudents, deleteStudents, updateStudent };
