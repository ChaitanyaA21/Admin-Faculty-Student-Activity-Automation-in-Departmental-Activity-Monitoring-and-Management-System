const {studentModel} = require('../Models/student.model.js')
const ApiResponse =require('../Utils/ApiResponse.utils.js')
const ApiError =require('../Utils/ApiError.utils.js')

const sortingData=require('../Utils/DataSorting.utils.js')

const fs = require('fs')
const XLSX = require('xlsx')

//Student registration
const registerStudent= async (req,res)=>{

if(req.body.addFile){
//Student registration-2
//Student registration using a excel file
//To Do's
//Retrieve the data from frontend
const workbook = await XLSX.read(fs.readFileSync(req.file.path))

let worksheets = {};
//Segregation of data obatianed from Excel
for(const sheetName of workbook.SheetNames) {
    worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
}


//Validation-no empty fields for required fields(if found send back an error of correction request)
worksheets.Sheet1.forEach(object => {
    object.forEach(field => {
        if(field.trim()===""){
            return new ApiError(400,`${object.firstname} has some missing details`)
        }
    });
});

//Sort them according to surname(Separate name into first name and last name so that sorting on surnames can be done)
let data= await sortingData(worksheets)
//Generate roll no's
let rollnumbers = await rollnoGenerator(new Date().getFullYear,data[0].branch,data[0].specialization,data.length)

//create and save the student login details as a whole
for (let index = 0; index < array.length; index++) {
    studentModel.create({
        rollNo:rollnumbers[index],
        firstname:data[index].firstname,
        lastname:data[index].lastname,
        email:data[index].email,
        phoneNo:data[index].phoneNo,
        aadharNo:data[index].aadharNo,
        motherName:data[index].motherName,
        fatherName:data[index].fatherName,
        parentNo:data[index].parentNo,
        dateOfBirth:data[index].dateOfBirth,
        permanentAddress:data[index].permanentAddress,
        presentAddress:data[index].presentAddress,
        bloodGroup:data[index].bloodGroup,
        caste:data[index].caste,
        religion:data[index].religion,
        branch:data[index].branch,
        specialization:data[index].specialization,
        semNumber:data[index].semNumber
    }) 
}

}
else{
    
//take details from frontend for adding single student 
        const { rollNo,firstname,lastname,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber} = req.body

        console.log(rollNo,firstname,lastname,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber)
//check whether all the details are present
        const detailsCheck =[rollNo,firstname,lastname,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber].some(field => String(field).trim() ==='');
        if(detailsCheck){
            console.log("The fileds are emptyy.Fill All the fileds");
        }
        else{
            console.log("All the details are Entered");
        }
//check whether already user exists or not:email,rollno
//Two cases must me considered
//1-->Reregitering student
//2-->just checking for Existing rollno
        var userCheck;
        try {
            console.log("Checking user...")
            userCheck = await studentModel.findOne({ rollNo: rollNo });
        } catch (error) {
            console.log("Error : in finding the existance of the user in db",error)
        }

        if(userCheck){
            console.log("UserAlready Exists with roll No: " ,rollNo);
            return  res.send("User already exists")
        }
//create user if doesn't exist
//Type-1 of creating user
        console.log("Storing student details");
        const studentData = new studentModel({
            rollNo,firstname,lastname,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber
        });
        await studentData.save()
        console.log("Stored student details");
//Type-2 of creating user

//instead of .save use .create()
// await studentModel.create(studentData)
//return response
// return studentData
        console.log("Returning the status");
        const response =new ApiResponse(200,studentData);
        res.status(response.statusCode).json(response);
}

}
module.exports =registerStudent