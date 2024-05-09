const mongoose = require('mongoose');

const studentSchema=mongoose.Schema({
        rollNo:{
            type:String,
            uppercase:true
            //add upper case
        },
        name:{
            type:String,
            required:true,
            
        },
        email:{
            type:String,
            required:true},
        phoneNo :{
            type:Number,
            required:true
        },
        aadharNo:{
            type:Number,
            required:true
        },
        motherName:{
            type:String,
        },
        fatherName:{
            type:String,  
        },
        parentNo:{
            type:Number,
            required:true
        },
        dateOfBirth:{
            type:Date,
            required:true
        },
        permanentAddress:{
            type:String,
            required:true
        },
        presentAddress:{
            type:String,
            required:true
        },
        bloodGroup:{
            type:String,
            required:true
        },
        caste:{
            type:String,
            required:true
        },
        religion:{
            type:String,
            required:true
        },
        branch:{
            type:String,
            required:true,
            uppercase:[true,"Branch Must be in uppercase"]
        },
        specialization:{
            type:String,
            required:true
        },
        semNumber:{
            type:Number,
            required:true,
            default:1
        }

        
},
{timestamps:true}


);
const student=mongoose.model("student",studentSchema);
module.exports = student;