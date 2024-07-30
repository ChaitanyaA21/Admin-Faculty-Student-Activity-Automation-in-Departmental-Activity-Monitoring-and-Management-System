const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const generateAccessAndRefreshTokens = async (facultyId) => {
  try {
    const faculty = await facultyLogin.findById(facultyId);

    const accessToken = faculty.generateAccessToken();
    const refreshToken = faculty.generateRefreshToken();

    faculty.refreshToken = refreshToken;
    await faculty.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating refresh and access tokens: ${error.message}`
    );
  }
};

const loginFaculty = asyncHandler(async (req, res) => {
  // TO DOS
  // req body -> data

  const { facultyId, password } = req.body;

  if (!facultyId) {
    throw new ApiError(400, "facultyId is required");
  }

  // find the user
  const faculty = await facultyLogin.findOne({ facultyId: facultyId });

  if (!faculty) {
    throw new ApiError(404, "faculty does not exist with this facultyId");
  }

  // password check
  const isPasswordValid = await faculty.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user Credentials");
  }

  // access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    faculty._id
  );

  const loggedInFaculty = await facultyLogin
    .findById(faculty._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // send cookie

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInFaculty,
          accessToken,
          refreshToken,
        },
        "User logged in succesfully"
      )
    );
});

const logoutFaculty = asyncHandler(async (req, res) => {
  await facultyLogin.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const faculty = await facultyLogin.findById(decodedToken?._id);

    if (!faculty) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== faculty?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshTokens(faculty._id);

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
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

module.exports = {
  loginFaculty,
  logoutFaculty,
  refreshAccessToken,
};
