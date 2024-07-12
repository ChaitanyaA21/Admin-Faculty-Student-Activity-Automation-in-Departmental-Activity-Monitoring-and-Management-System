const { studentModel } = require("../../Admin/Models/student.model.js")
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");


const updateContact = asyncHandler(async (req, res) => {
    const {rollNo, newphoneNo, newEmail} = req.body;

    if(!rollNo) {
        throw new ApiError(400, "Roll no is required");
    }

    let result1 = null, result2 = null;
    let updated = "";
    if(newphoneNo) {
        result1 = await studentModel.findOneAndUpdate(
            {
                rollNo:rollNo
            },
            {
                phoneNo: newphoneNo
            },
            {
                new:true
            }
        )

        updated += `Phone Number: ${result1.phoneNo}`
    }
    if(newEmail) {
        result2 = await studentModel.findOneAndUpdate(
            {
                rollNo:rollNo
            },
            {
                email: newEmail
            },
            {
                new:true
            }
        )
        updated += ` Email ID: ${result2.email}`
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                msg: `Following are updated ${updated}`
            },
            "Successfull"
        )
    )
})

module.exports = {updateContact}