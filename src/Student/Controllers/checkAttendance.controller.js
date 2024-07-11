const {studentModel} = require("../../Admin/Models/student.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const checkAttendance = asyncHandler(async (req, res) => {
    const {rollNo, semNo, subjectName} = req.body;

    if(!rollNo) {
        throw new ApiError(400, "Roll no is required");
    }

    const student = await studentModel.findOne({rollNo: rollNo});

    if(!student) {
        throw new ApiError(404, "Student details not found")
    }

    const subject = Object.fromEntries(student.semNumber[0].subjects);
    const studentData = subject[subjectName].attendance.length;

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                studentAttendanceData : studentData,
            },
            "Successfull"
        )
    )
})

module.exports = {checkAttendance}