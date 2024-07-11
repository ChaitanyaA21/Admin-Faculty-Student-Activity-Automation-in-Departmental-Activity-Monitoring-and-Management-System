const {studentLogin} = require("../../Admin/Models/studentLogin.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const updatePassword = asyncHandler(async (req, res) => {
    const {rollNo, newPassword} = req.body;

    if(!rollNo) {
        throw new ApiError(400, "Rollno is required");
    }

    const student = await studentLogin.findOne({rollNo: rollNo});

    if(!student) {
        throw new ApiError(404, "Student does not exist with this roll no");
    }

    await studentLogin.findOneAndUpdate(
        {
            rollNo: rollNo
        },
        {
            password: newPassword
        },
        {
            new: true
        }
    );

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                msg: "Successfull"
            },
            "Successfully updated password"
        )
    )
})

module.exports = {updatePassword}