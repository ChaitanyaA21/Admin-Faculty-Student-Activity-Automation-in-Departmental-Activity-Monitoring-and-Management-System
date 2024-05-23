const {facultyModel}=require('../Models/faculty.model')
const {ApiResponse} =require('../Utils/ApiResponse.utils.js')
const {ApiError} =require('../Utils/ApiError.utils.js')


const registerFaculty= async (req,res)=>{
    //Data from frontend
    const {name,email,altEmail,phoneNo,aadharNo,designation,experience,subjects}=req.body
    //Check all the fields are present or not
    const detailsCheck =[name,email,altEmail,phoneNo,aadharNo,designation,experience,subjects].some(field => String(field).trim() ==='');
        if(detailsCheck){
            console.log("The fileds are emptyy.Fill All the fileds");
        }
        else{
            console.log("All the details are Entered");
        }
    //Create Faculty id's
    const facultyId=facultyIdGenerator()
    //Generate Password
    const facultypassword = process.env.FACULTY_PASSWORD
    //Save the faculty details in the db
    const facultyData = facultyModel.create({
        facultyId,name,email,altEmail,phoneNo,aadharNo,designation,experience,subjects
    })

    await facultyModel.create({
        facultyId,
        password:facultypassword
      });
    return res.status(201).json(
        new ApiResponse(200, true, "Faculty registered Successfully")
    )
}
module.exports={registerFaculty}