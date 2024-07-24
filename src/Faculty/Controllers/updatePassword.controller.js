const {facultyLogin}=require("../../Admin/Models/facultyLogin.model.js")
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const updatePassword = asyncHandler(async (req, res) => {
    const {facultyId, newPassword} = req.body;

    if(!facultyId) {
        throw new ApiError(400, "faculty Id is required");
    }

    const faculty = await facultyLogin.findOne({facultyId:facultyId});

    if(!faculty) {
        throw new ApiError(404, "faculty does not exist with this faculty Id");
    }

    await facultyLogin.findOneAndUpdate(
        {
            facultyId: facultyId
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