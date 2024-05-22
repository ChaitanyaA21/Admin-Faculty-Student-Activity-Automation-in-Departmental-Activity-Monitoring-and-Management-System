// Middleware function with file name auth.middleware.js
const { ApiError } = require("../Utils/ApiError.utils.js")
const { asyncHandler } = require("../Utils/asyncHandler.utils.js")
const { studentLogin } = require("../Models/studentLogin.model.js")
const jwt = require("jsonwebtoken")

const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log(req.cookies)
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const student = await studentLogin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!student) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = student
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

module.exports = verifyJWT