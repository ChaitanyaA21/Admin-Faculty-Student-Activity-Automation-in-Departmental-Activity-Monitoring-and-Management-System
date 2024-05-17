const studentModel =require('../Models/student.model.js')
const ApiResponse =require('../Utils/ApiResponse.utils.js')
const registerStudent= async (req,res)=>{
    //take details from frontend
    const { rollNo,name,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber} = req.body


    console.log(rollNo,name,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber)


    //check whether all the details are present
    const detailsCheck =[rollNo,name,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber].some(field => String(field).trim() ==='');
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
        const userCheck = await studentModel.findOne({ rollNo: rollNo });
        if(userCheck){
            return console.log("UserAlready Exists with roll No: " ,rollNo);
        }
    //create user if doesn't exist
    //Type-1 of creating user

    const studentData = new studentModel({
        rollNo,name,email,phoneNo,aadharNo,motherName,fatherName,parentNo,dateOfBirth,permanentAddress,presentAddress,bloodGroup,caste,religion,branch,specialization,semNumber
    });
    await studentData.save()

    //Type-2 of creating user

    //instead of .save use .create()
    // await studentModel.create(studentData)
    //return response
    // return studentData
    return new ApiResponse(200,studentData);
}

module.exports =registerStudent