const { noticeBoard } = require("../../Admin/Models/noticeBoard.model.js");
const {
  academicCalendar,
} = require("../../Admin/Models/academicCalendar.model.js");
const { studentModel } = require("../../Admin/Models/student.model.js");
const { studentForms } = require("../../Admin/Models/studentForms.model.js");
const { forms } = require("../../Admin/Models/forms.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");

const viewFiles = asyncHandler(async (req, res) => {
  const student = await studentModel.findOne(
    { rollNo: req.user.rollNo },
    { branch: 1, _id: 0 }
  );

  if (!student) {
    throw new ApiError(400, "Student record does not exist");
  }

  const academicYear =
    1000 * Number(new Date().getFullYear().toString()[0]) +
    Number(req.user.rollNo.slice(0, 2));

  let data,
    msg = "Files";
  switch (req.params.type) {
    case "notice":
      data = await noticeBoard.find(
        {
          branch: student.branch,
          academicYear,
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
          branch: student.branch,
          academicYear,
        },
        {
          title: 1,
          url: 1,
          _id: 0,
        }
      );
      msg = "Academic Calenders";
      break;

    case "studentforms":
      data = await studentForms.find(
        { rollNo: req.user.rollNo },
        {
          title: 1,
          url: 1,
          _id: 0,
        }
      );
      msg = "Student Forms";
      break;

    case "forms":
      data = await forms.find(
        {},
        {
          title: 1,
          url: 1,
          _id: 0,
        }
      );
      msg = "Forms";
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
