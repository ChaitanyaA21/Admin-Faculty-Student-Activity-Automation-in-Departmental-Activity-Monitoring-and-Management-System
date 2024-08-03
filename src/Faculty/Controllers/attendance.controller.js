const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

const addAttendance = asyncHandler(async (req, res) => {
  const { presentRollNos, absentRollNos, subjectName, date } = req.body;

  const normalizeToMidnight = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const currentDate = normalizeToMidnight(date);

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

const updateAttendance = asyncHandler(async (req, res) => {
  // const { ids, {  } } = req.body;

  if (!Array.isArray(ids) || ids.length == 0) {
    throw new ApiError(404, "Client Error: Correct details are not provided");
  }

  // const result =
});

module.exports = { addAttendance };
