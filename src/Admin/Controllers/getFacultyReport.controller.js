const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { facultyModel } = require("../Models/faculty.model.js");
const { workShop } = require("../Models/workshop.model.js");

const getFacultyReport = asyncHandler(async (req, res) => {
  const { facultyId } = req.body;

  if (!facultyId) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "Client Error: Details Not provided"));
    throw new ApiError(400, "Client Error: Details Not provided");
  }

  let resultData = [];
  let result;

  result = await facultyModel.find(
    { facultyId },
    { facultyId: 0, createdAt: 0, updatedAt: 0 }
  );
  resultData.push(result);
  result = await workShop.find({ userId: facultyId }, { userId: 0 });
  resultData.push(result);

  return res.status(200).json(new ApiResponse(200, resultData, "Successful"));
});

module.exports = { getFacultyReport };
