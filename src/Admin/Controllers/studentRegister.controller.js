const { studentModel } = require("../Models/student.model.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { studentLogin } = require("../Models/studentLogin.model.js");

const fs = require("fs");
const XLSX = require("xlsx");

//Sorting logic
function compare(a, b) {
  if (a.Names > b.Names) {
    return 1;
  } else if (a.Names < b.Names) {
    return -1;
  }
  return 0;
}

//RollNo Generating function
function rollnoGenerator(studentData) {
  try {
    let year = new Date().getFullYear().toString();
    let rollNo = `${year[year.length - 2]}${year[year.length - 1]}031`;
    let data = JSON.parse(
      fs.readFileSync("./src/Admin/Controllers/data.json", "utf8")
    )[studentData[0].branch.toUpperCase()];
    if (!studentData[0].specialization) {
      rollNo = rollNo + data;
    } else if (studentData[0].specialization) {
      rollNo = rollNo + data[studentData[0].specialization];
    }

    for (let i = 1; i <= studentData.length; i++) {
      let fourDigitNumber = i.toString().padStart(4, "0");
      let t = rollNo;
      t = t + fourDigitNumber;

      studentData[i - 1]["rollNo"] = t;
    }
  } catch (error) {
    throw new ApiError(500, `Problem in Generating roll number ${error}`);
  }
}

//Student registration
const registerStudent = async (req, res) => {
  if (req.body.addFile) {
    try {
      //Student registration-2
      //Student registration using a excel file
      //To Do's
      //Retrieve the data from frontend
      const workbook = await XLSX.read(fs.readFileSync(req.file.path));

      let worksheets = {};
      //Segregation of data obatianed from Excel
      for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );
      }

      //Validation-no empty fields for required fields(if found send back an error of correction request)
      worksheets.Sheet1.forEach((object) => {
        for (const key in object) {
          if (object[key].toString().trim() === "") {
            throw new ApiError(
              400,
              `${object["firstname"]} has some missing details`
            );
          }
        }
      });

      //Sort them according to surname(Separate name into first name and last name so that sorting on surnames can be done)

      let data = await worksheets.Sheet1.sort(compare);

      //Generate roll no's
      rollnoGenerator(data);

      //create and save the student login details as a whole
      const studentpassword = process.env.STUDENT_PASSWORD;
      for (let index = 0; index < data.length; index++) {
        const student = await studentModel.create({
          rollNo: data[index].rollNo,
          firstname: data[index].firstname,
          lastname: data[index].lastname,
          email: data[index].email,
          phoneNo: data[index].phoneNo,
          aadharNo: data[index].aadharNo,
          motherName: data[index].motherName,
          fatherName: data[index].fatherName,
          parentNo: data[index].parentNo,
          dateOfBirth: data[index].dateOfBirth,
          permanentAddress: data[index].permanentAddress,
          presentAddress: data[index].presentAddress,
          bloodGroup: data[index].bloodGroup,
          caste: data[index].caste,
          religion: data[index].religion,
          branch: data[index].branch,
          specialization: data[index].specialization,
          academicYear: data[index].academicYear,
        });
        await studentLogin.create({
          rollNo: student.rollNo,
          password: studentpassword,
        });
      }
      return res
        .status(201)
        .json(new ApiResponse(200, true, "User registered Successfully"));
    } catch {
      throw new ApiError(
        500,
        error?.message || "Error in registering student Details"
      );
    } finally {
      fs.unlinkSync(req.file.path);
    }
  } else {
    //take details from frontend for adding single student
    const {
      rollNo,
      firstname,
      lastname,
      email,
      phoneNo,
      aadharNo,
      motherName,
      fatherName,
      parentNo,
      dateOfBirth,
      permanentAddress,
      presentAddress,
      bloodGroup,
      caste,
      religion,
      branch,
      specialization,
      academicYear,
    } = req.body;

    //check whether all the details are present
    const detailsCheck = [
      rollNo,
      firstname,
      lastname,
      email,
      phoneNo,
      aadharNo,
      motherName,
      fatherName,
      parentNo,
      dateOfBirth,
      permanentAddress,
      presentAddress,
      bloodGroup,
      caste,
      religion,
      branch,
      academicYear,
    ].some((field) => String(field).trim() === "");
    if (detailsCheck) {
      console.log("The fileds are emptyy.Fill All the fileds");
    }
    //check whether already user exists or not:email,rollno
    //Two cases must me considered
    //1-->Reregitering student
    //2-->just checking for Existing rollno
    var userCheck;
    try {
      userCheck = await studentModel.findOne({ rollNo: rollNo });
    } catch (error) {
      console.log("Error : in finding the existance of the user in db", error);
    }

    if (userCheck) {
      console.log("UserAlready Exists with roll No: ", rollNo);
      return res.send("User already exists");
    }
    //create user if doesn't exist
    //Type-1 of creating user
    const studentData = new studentModel({
      rollNo,
      firstname,
      lastname,
      email,
      phoneNo,
      aadharNo,
      motherName,
      fatherName,
      parentNo,
      dateOfBirth,
      permanentAddress,
      presentAddress,
      bloodGroup,
      caste,
      religion,
      branch,
      specialization,
      academicYear,
    });
    await studentData.save();

    const studentpassword = process.env.STUDENT_PASSWORD;
    await studentLogin.create({
      rollNo: rollNo,
      password: studentpassword,
    });
    //Type-2 of creating user

    //instead of .save use .create()
    // await studentModel.create(studentData)
    // return response
    // return studentData
    const response = new ApiResponse(200, studentData);
    res.status(response.statusCode).json(response);
  }
};

const getStudentDetails = async (req, res) => {
  let { branch, academicYear, specialization } = req.body;

  let query = {};
  if (!branch || (!academicYear && !specialization)) {
    throw new ApiError(404, "Details not provided");
  }

  academicYear = Number(academicYear);
  query.branch = branch;
  query.academicYear = Number(academicYear);

  if (specialization) {
    query.specialization = specialization;
  }

  const result = await studentModel.find(query, {
    rollNo: 1,
    firstname: 1,
    lastname: 1,
  });

  res.status(200).json(new ApiResponse(200, result, "Successful"));
};

module.exports = { registerStudent, getStudentDetails };
