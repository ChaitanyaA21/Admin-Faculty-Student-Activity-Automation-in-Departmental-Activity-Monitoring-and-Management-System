const { facultyModel } = require("../Models/faculty.model.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");

function facultyIdGenerator(experience) {
  let year = new Date().getFullYear().toString();
  let facultyId = `${year[year.length - 2]}${year[year.length - 1]}S`;
  facultyId = facultyId + experience;
  console.log(facultyId);
  return facultyId;
}
const registerFaculty = async (req, res) => {
  //Data from frontend
  const {
    name,
    email,
    altEmail,
    phoneNo,
    aadharNo,
    designation,
    experience,
    subjects,
  } = req.body;
  console.log(
    name,
    email,
    altEmail,
    phoneNo,
    aadharNo,
    designation,
    experience,
    subjects
  );
  //Check all the fields are present or not
  const detailsCheck = [
    name,
    email,
    altEmail,
    phoneNo,
    aadharNo,
    designation,
    experience,
    subjects,
  ].some((field) => String(field).trim() === "");

  if (detailsCheck) {
    console.log("The fileds are emptyy.Fill All the fileds");
  } else {
    console.log("All the details are Entered");
  }

  //Create Faculty id's
  const facultyIdG = facultyIdGenerator(experience);
  //Generate Password
  const facultypassword = process.env.FACULTY_PASSWORD;
  //Save the faculty details in the db
  let facultyId;
  console.log();
  const facultyData = new facultyModel({
    facultyId: facultyIdG,
    name,
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
};
module.exports = { registerFaculty };
