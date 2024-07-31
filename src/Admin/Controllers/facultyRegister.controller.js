const { facultyModel } = require("../Models/faculty.model.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const { subject } = require("../../Admin/Models/subject.model.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");

function facultyIdGenerator(experience) {
  let year = new Date().getFullYear().toString();
  let facultyId = `${year[year.length - 2]}${year[year.length - 1]}S`;
  facultyId = facultyId + experience;
  return facultyId;
}
const registerFaculty = asyncHandler(async (req, res) => {
  //Data from frontend
  try {
    const {
      firstname,
      lastname,
      email,
      altEmail,
      phoneNo,
      aadharNo,
      designation,
      experience,
    } = req.body;

    //Check all the fields are present or not
    const detailsCheck = [
      firstname,
      lastname,
      email,
      altEmail,
      phoneNo,
      aadharNo,
      designation,
      experience,
    ].some((field) => String(field).trim() === "");

    if (detailsCheck) {
      throw new ApiError(400, "The fileds are emptyy.Fill All the fileds");
    } else {
      new ApiResponse(200, "All the details are Entered");
    }

    //Create Faculty id's
    const facultyIdG = facultyIdGenerator(experience);
    //Generate Password
    const facultypassword = process.env.FACULTY_PASSWORD;
    //Save the faculty details in the db
    const facultyData = new facultyModel({
      facultyId: facultyIdG,
      firstname,
      lastname,
      email,
      altEmail,
      phoneNo,
      aadharNo,
      designation,
      experience,
    });
    await facultyData.save();

    const facultyLoginData = new facultyLogin({
      facultyId: facultyIdG,
      password: facultypassword,
    });
    await facultyLoginData.save();
    return res
      .status(201)
      .json(new ApiResponse(200, true, "Faculty registered Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while Saving the data"
    );
  }
});

const getSubjects = asyncHandler(async (req, res) => {
  const { semNo } = req.body;

  let query = {},
    resultFilter = {};
  if (req.user?.facultyId) {
    query.facultyId = req.user.facultyId;
    resultFilter = {
      branch: 1,
      specialization: 1,
      academicYear: 1,
      subjectName: 1,
      semNo: 1,
    };
  } else if (req.userDetails) {
    query = {
      branch: req.userDetails.branch,
      academicYear: req.userDetails.academicYear,
      semNo: semNo ? semNo : req.userDetails?.semNo,
    };
    resultFilter = {
      subjectName: 1,
      _id: 0,
    };
    if (req.userDetails?.specialization) {
      query.specialization = req.userDetails.specialization;
    }
  } else {
    throw new ApiError(404, "Internal server Error:User Not Found");
  }

  const result = await subject.find(query, resultFilter);
  if (!result) {
    return res.status(500);
  }

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

const assignSubject = asyncHandler(async (req, res) => {
  const { subjectId, facultyId } = req.body;

  if (!subjectId || !facultyId) {
    throw new ApiError(404, "Details are not provided");
  }

  const result = await subject.findOneAndUpdate(
    {
      subjectId,
    },
    {
      facultyId: facultyId,
    },
    {
      new: true,
    }
  );

  let result2;
  if (result) {
    const subjectId = result.subjectId;
    const subjectName = result.subjectName;

    const subject = { subjectId, subjectName };

    result2 = await facultyModel.findOneAndUpdate(
      {
        facultyId: facultyId,
      },
      { $push: { subjects: subject } },
      {
        new: true,
      }
    );
  }

  res.status(200).json(new ApiResponse(200, result2, "Successful"));
});

const updateAssignedSubject = asyncHandler(async (req, res) => {
  const { oldFacultyId, newFacultyId } = req.body;

  if (!oldFacultyId || !newFacultyId) {
    throw new ApiError(404, "Details not provided");
  }

  const record = await subject.findOne({ facultyId: oldFacultyId });

  if (!record) {
    throw new ApiError(500, "Internal Server Error: Faculty not found");
  }

  record.facultyId = newFacultyId;
  const result = await record.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = {
  registerFaculty,
  getSubjects,
  assignSubject,
  updateAssignedSubject,
};
