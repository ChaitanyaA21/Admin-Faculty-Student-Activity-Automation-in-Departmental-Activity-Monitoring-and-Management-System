const { studentModel } = require("../../Admin/Models/student.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

const getClassmates = asyncHandler(async (req, res) => {
  let query = {
    branch: req.userDetails?.branch,
    academicYear: req.userDetails?.academicYear,
    semNo: req.userDetails?.semNo,
  };

  if (req.userDetails.specialization) {
    query.specialization = req.userDetails.specialization;
  }

  const result = await studentModel.find(query, {
    rollNo: 1,
    firstname: 1,
    lastname: 1,
  });

  if (!result) {
    throw new ApiError(500, "Allocation is in progress");
  }

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = { getClassmates };
