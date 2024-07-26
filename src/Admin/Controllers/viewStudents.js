const { studentModel } = require("../Models/student.model.js");

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

module.exports = { viewStudents, deleteStudents };
