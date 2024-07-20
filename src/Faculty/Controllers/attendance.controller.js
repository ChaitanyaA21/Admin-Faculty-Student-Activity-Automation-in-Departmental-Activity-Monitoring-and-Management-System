const {studentModel}=require("../../Admin/Models/student.model.js");
const {asyncHandler}=require("../../Admin/Utils/asyncHandler.utils.js")
const {ApiResponse}=require("../../Admin/Utils/ApiResponse.utils.js")
const {ApiError}=require("../../Admin/Utils/ApiError.utils.js")
const updateAttendance = (async (req,res) => {
    try {
        const currentDate = new Date();

        const {studentRollNo, semNo, subjectName} = req.body;

        for(let rollNo of studentRollNo){
            
            await studentModel.findOneAndUpdate(
                { 
                    rollNo: rollNo,
                    'semNumber.semNo': semNo,
                    [`semNumber.subjects.${subjectName}.subjectName`]: subjectName 
                },
                { 
                    $push: { [`semNumber.$[semIndex].subjects.${subjectName}.attendance`]: currentDate }
                },
            
                { 
                    new: true,
                    arrayFilters: [{ 'semIndex.semNo': semNo }] 
                }
            );
            console.log('Attendance updated with current date for rollno:', rollNo);
        }
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    message:"successful"
                },
                "successful"
            )
        )
    } catch (err) {
        console.error('Error updating attendance:', err);
        throw new ApiError(404, "Error while updating attendance")
    }
});

module.exports={updateAttendance}




// const addAttendance = async(studentRollNumbers)=>{
//     const today = new Date();

    
//     studentModel.updateOne(
//         {}
//     )

    
// }




// // Ensure date-fns is included in your project
// const { format } = require('date-fns');

// // Current date
// const today = new Date();

// // Formatted date (YYYY-MM-DD)
// console.log(format(today, 'yyyy-MM-dd'));  // e.g., 2024-06-06

// // Formatted date (DD/MM/YYYY)
// console.log(format(today, 'dd/MM/yyyy'));  // e.g., 06/06/2024
