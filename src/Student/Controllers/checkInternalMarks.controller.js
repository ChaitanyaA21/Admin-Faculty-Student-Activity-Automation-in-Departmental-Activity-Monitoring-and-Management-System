const {studentModel} = require("../../Admin/Models/student.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const checkInternalMarks = asyncHandler(async (req, res) => {
    const {rollNo, semNo, internal, subjectName} = req.body;

    if(!rollNo) {
        throw new ApiError(400, "Roll no is required");
    }

    const student = await studentModel.findOne({rollNo: rollNo});

    if(!student) {
        throw new ApiError(400, "Student details not found");
    }

    const subject = Object.fromEntries(student.semNumber[semNo].subjects);
    let internalmrks = subject[subjectName].marks;

    if(internal === 1) {
        internalmrks = internalmrks.internalOne;
    }
    else if(internal === 2) {
        internalmrks = internalmrks.internalTwo;
    }
    console.log(internalmrks);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                internalmrks: internalmrks
            },
            "Successfull"
        )
    )
})

module.exports = {checkInternalMarks}