const {facultyModel}=require("../../Admin/Models/faculty.model.js")
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js")

const checkProfile = asyncHandler(async (req, res) => {
   
   
    const faculty = await facultyModel.findOne({facultyId: req.user.facultyId});

    if(!faculty) {
        throw new ApiError(400, "Faculty details not found");
    }
    
    console.log(faculty);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                data : faculty
            },
            "Successfull"
        )
    )
})

module.exports = {checkProfile}