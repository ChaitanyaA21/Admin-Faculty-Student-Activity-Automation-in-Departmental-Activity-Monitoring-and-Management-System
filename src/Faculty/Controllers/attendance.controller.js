const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const updateAttendance = async (req, res) => {
  const { studentRollNos, subjectName } = req.body;

  const currentDate = new Date();

  for (const rollNo of studentRollNos) {
    await marksAndAttendanceModel.findOneAndUpdate(
      {
        rollNo: rollNo,
        subjectName,
      },
      {
        $push: {
          attendance: currentDate,
        },
      },

      {
        new: true,
        upsert: true,
        runValidators: false,
      }
    );
    console.log("Attendance updated with current date for rollno:", rollNo);
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        message: "successful",
      },
      "successful"
    )
  );
};

module.exports = { updateAttendance };
// const addAttendance = async(studentRollNumbers)=>{
//     const today = new Date();

//     studentModel.updateOne(
//         {}
//     )

// }

// // Ensure date-fns is included in your project
// const { format } = require('date-fns');

// // Current date
// const today = new Date();

// // Formatted date (YYYY-MM-DD)
// console.log(format(today, 'yyyy-MM-dd'));  // e.g., 2024-06-06

// // Formatted date (DD/MM/YYYY)
// console.log(format(today, 'dd/MM/yyyy'));  // e.g., 06/06/2024
