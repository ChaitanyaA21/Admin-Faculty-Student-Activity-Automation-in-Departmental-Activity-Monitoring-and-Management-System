const { noticeBoard } = require("../../Admin/Models/noticeBoard.model.js");
const {
  academicCalendar,
} = require("../../Admin/Models/academicCalendar.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");

const viewFiles = asyncHandler(async (req, res) => {
  const { branch, academicYear } = req.body;

  let data,
    msg = "Files";
  switch (req.params.type) {
    case "notice":
      data = await noticeBoard.find(
        {
          userType: "faculty",
        },
        {
          title: 1,
          url: 1,
          _id: 0,
        }
      );
      msg = "Notices";
      break;

    case "academiccalendar":
      data = await academicCalendar.find(
        {
          userType: "faculty",
          branch,
          academicYear,
        },
        {
          title: 1,
          url: 1,
          branch: 1,
          academicYear: 1,
          _id: 0,
        }
      );
      msg = "Academic Calenders";
      break;

    default:
      break;
  }

  if (!data) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `No ${msg} is available at the moment`,
          "Successful"
        )
      );
  }

  res.status(200).json(new ApiResponse(200, data, "Successful"));
});

module.exports = { viewFiles };
