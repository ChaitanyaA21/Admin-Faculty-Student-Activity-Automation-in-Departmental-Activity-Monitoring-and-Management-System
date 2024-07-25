const { facultyModel } = require("../Models/faculty.model.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");

function facultyIdGenerator(experience) {
  let year = new Date().getFullYear().toString();
  let facultyId = "${year[year.length - 2]}${year[year.length - 1]}S";
  facultyId = facultyId + experience;
  return facultyId;
}
const registerFaculty = async (req, res) => {
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
      subjects,
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
};
module.exports = { registerFaculty };
