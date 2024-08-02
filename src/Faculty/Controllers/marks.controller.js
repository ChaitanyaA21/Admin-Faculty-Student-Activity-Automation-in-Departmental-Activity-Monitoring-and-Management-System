const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");

const updateInternalMarks = asyncHandler(async (req, res) => {
  const { subjectName, internalValue, studentMarks } = req.body;

  if (!subjectName || !(internalValue + 1) || !studentMarks) {
    throw new ApiError(404, "Details not given correctly");
  }

  const internalField = internalValue === 0 ? 1 : 2;

  for (const [rollNo, marks, assignment, presentation] of studentMarks) {
    const updateData = {
      internalNo: internalField,
      marks,
      assignment,
      presentation,
    };

    let record = await marksAndAttendanceModel.findOne({
      rollNo: rollNo,
      subjectName,
    });

    if (!record) {
      record = new marksAndAttendanceModel({
        rollNo,
        subjectName,
        internal: [updateData],
      });
    } else {
      record.internal.push(updateData);
    }

    await record.save({ validateBeforeSave: false });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Internal Marks ${internalField} has been updated`,
        "successful"
      )
    );
});

module.exports = { updateInternalMarks };
