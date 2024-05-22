const { asyncHandler } = require("../Utils/asyncHandler.utils.js")
const { ApiError } = require("../Utils/ApiError.utils.js")
const { ApiResponse } = require("../Utils/ApiResponse.utils.js")
const { studentLogin } = require("../Models/studentLogin.model.js")
const jwt = require("jsonwebtoken")

const generateAccessAndRefreshTokens = async (studentID) => {
    try {
        const student = await studentLogin.findById(studentID)
        
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating refresh and access tokens: ${error.message}`)
    }
}

const loginStudent = asyncHandler(async (req, res) => {
    // TO DOS
    // req body -> data

    const {rollNo, password} = req.body

    if(!rollNo) {
        throw new ApiError(400, "rollno is required")
    }

    // find the user

    const student = await studentLogin.findOne({rollNo})

    if(!student) {
        throw new ApiError(404, "Student does not exist with this roll no")
    }

    // password check
    const isPasswordValid = await student.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user Credentials")
    }

    // access and refresh token

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(student._id)
    

    const loggedInStudent = await studentLogin.findById(student._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // send cookie

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInStudent, accessToken, refreshToken
            },
            "User logged in succesfully"
        )
    )
})

const logoutStudent = asyncHandler( async (req, res) => {
    console.log(req.user._id);
    await studentLogin.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged Out")
    )
})

const refresAccessToken = asyncHandler( async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if (incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request")
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const student = await studentLogin.findById(decodedToken?._id)
    
        if(!student) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== student?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(student._id)
    
        return res
        .status(200)
        .cookie("accessToken", options)
        .cookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newrefreshToken },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid refresh token")
    }
})

module.exports = {
    loginStudent,
    logoutStudent,
    refresAccessToken
}