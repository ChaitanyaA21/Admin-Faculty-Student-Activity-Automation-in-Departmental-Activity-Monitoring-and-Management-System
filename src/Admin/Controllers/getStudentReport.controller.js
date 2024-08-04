const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { studentModel } = require("../Models/student.model.js");
const { internship } = require("../Models/internship.model.js");
const {
  marksAndAttendanceModel,
} = require("../Models/marksAndAttendance.model.js");
const { project } = require("../Models/projects.model.js");
const { studentForms } = require("../Models/studentForms.model.js");
const { workShop } = require("../Models/workshop.model.js");

const getStudentReport = asyncHandler(async (req, res) => {
  // first call viewStudents to get a list of students from this
  // a student rollNo should be selected then his/her student report will be given
  // **should call this controller one student at a time
  const { rollNo } = req.body;

  if (!rollNo) {
    res
      .status(400)
      .json(new ApiResponse(400, "Client Error: Details not provided"));
    throw new ApiError(400, "Client Error: Details not provided");
  }

  const databases = [
    studentModel,
    marksAndAttendanceModel,
    studentForms,
    project,
    internship,
    workShop,
  ];
  let resultData = [];
  for (let i = 0; i < databases.length; i++) {
    let result;
    if (i < databases.length - 1) {
      result = await databases[i].find(
        { rollNo },
        { rollNo: 0, createdAt: 0, updatedAt: 0 }
      );
    } else {
      result = await databases[i].find({ userId: rollNo }, { userId: 0 });
    }
    if (result) {
      resultData.push(result);
    }
  }

  return res.status(200).json(new ApiResponse(200, resultData, "Successful"));
});

module.exports = { getStudentReport };
