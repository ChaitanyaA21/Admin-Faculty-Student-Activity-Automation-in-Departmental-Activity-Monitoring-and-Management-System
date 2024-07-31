const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

const updateAttendance = asyncHandler(async (req, res) => {
  const { presentRollNos, absentRollNos, subjectName, semNo } = req.body;

  const currentDate = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;

  let result = [];

  for (const rollNo of presentRollNos) {
    const result1 = await marksAndAttendanceModel.findOneAndUpdate(

      {
        rollNo: rollNo,
        subjectName,
      },
      {
        $push: {
          present: currentDate,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    result.push(result1);
  }

  for (const rollNo of absentRollNos) {
    const result2 = await marksAndAttendanceModel.findOneAndUpdate(
      {
        rollNo: rollNo,
        subjectName,
      },
      {
        $push: {
          absent: currentDate,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    result.push(result2);
  }

  res.status(200).json(new ApiResponse(200, result, "successful"));
});


module.exports = { updateAttendance };
