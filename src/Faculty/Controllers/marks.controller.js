const { studentModel } = require("../../Admin/Models/student.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

const updateInternalMarks = asyncHandler(async (req, res) => {
  const { semNo, subjectName, internalMarksValue, studentMarks } = req.body;

  if (!semNo || !subjectName || !internalMarksValue || !studentMarks) {
    throw new ApiError(404, "Details not given correctly");
  }

  const internalField =
    internalMarksValue === 1 ? "internalOne" : "internalTwo";

  for (const [rollNo, marks, assignment, presentation] of studentMarks) {
    const updatePath = `semNumber.$[semIndex].subjects.${subjectName}.marks.${internalField}`;

    const updateData = {
      [`${updatePath}.marks`]: marks,
      [`${updatePath}.assignment`]: assignment,
      [`${updatePath}.presentation`]: presentation,
    };

    const result = await studentModel.updateOne(
      {
        rollNo: rollNo,
        "semNumber.semNo": semNo,
      },
      { $set: updateData },
      {
        arrayFilters: [{ "semIndex.semNo": semNo }],
      }
    );

    console.log(result);
  }

  if (!result) {
    throw new ApiError(
      500,
      "Internal Server Error while updating internal marks"
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        message: `${internalField} is updated`,
      },
      "successful"
    )
  );
});

module.exports = { updateInternalMarks };
