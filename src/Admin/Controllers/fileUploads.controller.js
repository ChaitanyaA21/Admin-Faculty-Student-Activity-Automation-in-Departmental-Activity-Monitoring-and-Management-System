const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../Utils/cloudinary.utils.js");
const fs = require("fs");
const { studentLogin } = require("../Models/studentLogin.model.js");

const { noticeBoard } = require("../Models/noticeBoard.model.js");
const { studentForms } = require("../Models/studentForms.model.js");
const { academicCalendar } = require("../Models/academicCalendar.model.js");
const { forms } = require("../Models/forms.model.js");

const uploadFile = asyncHandler(async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await uploadOnCloudinary(filePath);
    if (!result) {
      throw new ApiError(500, "Failed to upload file to Cloudinary");
    }

    let data;
    switch (req.params.type) {
      case "notice":
        data = new noticeBoard({
          title: req.body.title,
          url: result.url,
          userType: req.body.userType.toLowerCase(),
          public_id: result.public_id,
        });
        if (req.body.userType.toLowerCase() === "student") {
          data.branch = req.body.branch;
          data.academicYear = req.body.academicYear;
        }
        break;
      case "studentform":
        const studentExists = await studentLogin.findOne({
          rollNo: req.body.rollNo,
        });

        if (!studentExists) {
          throw new ApiError(
            400,
            "Student does not exist. Please upload student details first."
          );
        }
        data = new studentForms({
          rollNo: req.body.rollNo,
          title: req.body.title,
          url: result.url,
          public_id: result.public_id,
        });
        break;
      case "forms":
        data = new forms({
          title: req.body.title,
          url: result.url,
          public_id: result.public_id,
        });
        break;
      case "academicCalendar":
        data = new academicCalendar({
          title: req.body.title,
          url: result.url,
          branch: req.body.branch,
          academicYear: req.body.academicYear,
          public_id: result.public_id,
        });
        break;
      default:
        throw new ApiError(400, "Invalid type parameter");
    }
    
    await data.save();

    return res.json(
      new ApiResponse(200, { url: result.url }, "File uploaded successfully")
    );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while uploading the file"
    );
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

const viewFile = asyncHandler(async (req, res) => {
  try {
    const { type, userType, rollNo, branch, academicYear, semNo } = req.query;

    let data;
    switch (type) {
      case "notice":
        if (!userType) {
          throw new ApiError(400, "userType query parameter is required");
        }

        data = await noticeBoard.find({ userType: userType.toLowerCase() });
        break;

      case "studentform":
        if (!rollNo) {
          throw new ApiError(400, "rollNo query parameter is required");
        }
        data = await studentForms.find({ rollNo });
        break;

      case "forms":
        data = await forms.find({});
        break;

      case "academicCalendar":
        if (!branch || !academicYear || !semNo) {
          throw new ApiError(
            400,
            "branch, academicYear, and semNo query parameters are required"
          );
        }
        data = await academicCalendar.find({ branch, academicYear, semNo });
        break;

      default:
        throw new ApiError(400, "Invalid type parameter");
    }
    if (!data.length) {
      return res.json(
        new ApiResponse(200, "No Files Found with the given Data")
      );
    } else {
      return res.json(
        new ApiResponse(200, data, "Files retrieved successfully")
      );
    }
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while retrieving the files"
    );
  }
});

const deleteFile = asyncHandler(async (req, res) => {
  try {
    const { type } = req.query;
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      throw new ApiError(400, "publicIds array is required");
    }

    let Model;
    switch (type) {
      case "notice":
        Model = noticeBoard;
        break;
      case "studentform":
        Model = studentForms;
        break;
      case "forms":
        Model = forms;
        break;
      case "academicCalendar":
        Model = academicCalendar;
        break;
      default:
        throw new ApiError(400, "Invalid type parameter");
    }

    const deleteResults = [];
    for (const publicId of publicIds) {
      const cloudinaryResponse = await deleteFromCloudinary(publicId);
      if (cloudinaryResponse.result !== "ok") {
        throw new ApiError(
          500,
          `Failed to delete file from Cloudinary: ${publicId}`
        );
      }
      const data = await Model.findOneAndDelete({ public_id: publicId });
      if (!data) {
        throw new ApiError(404, `File not found in database: ${publicId}`);
      }
      deleteResults.push({ publicId, status: "deleted" });
    }

    return res.json(
      new ApiResponse(200, deleteResults, "Files deleted successfully")
    );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while deleting the files"
    );
  }
});

module.exports = {
  uploadFile,
  viewFile,
  deleteFile,
};
