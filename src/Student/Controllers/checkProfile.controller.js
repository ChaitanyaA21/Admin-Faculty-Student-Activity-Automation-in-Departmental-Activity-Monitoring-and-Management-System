const {studentModel} = require("../../Admin/Models/student.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const checkProfile = asyncHandler(async (req, res) => {
    const {rollNo} = req.body;

    if(!rollNo) {
        throw new ApiError(400, "Roll no is required");
    }

    const student = await studentModel.findOne({rollNo: rollNo}).select("-semNumber");

    if(!student) {
        throw new ApiError(400, "Student details not found");
    }
    
    console.log(student);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                data : student
            },
            "Successfull"
        )
    )
})

module.exports = {checkProfile}