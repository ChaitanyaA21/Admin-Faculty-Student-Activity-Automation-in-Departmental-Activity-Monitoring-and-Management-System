const mongoose = require('mongoose');

const marksSchema =mongoose.Schema({
    marks:{
        type:Number,
        default:0
    },
    assignment:{
        type:Number,
        default:0
    },
    presentation:{
        type:Number,
        default:0
    }
})
const internalMarksSchema =mongoose.Schema({
    internalOne:marksSchema,
    internalTwo:marksSchema
})

const subjectSchema =mongoose.Schema({
    subjectName:{
        type:String,
        //Will be uncommented after writing subject schema separately
        // required:true
    },
    marks: internalMarksSchema,
    attendance:[{
        type: Date,
    }]

    
})
const semesterSchema =mongoose.Schema({
    semNo:{
        type:Number,
        default:1
    },
    subjects:{
        type: Map,
        of: subjectSchema
    }
})
const studentSchema=mongoose.Schema({
        rollNo:{
            type:String,
            uppercase:true
            //add upper case
        },
        firstname:{
            type:String,
            required:true,
            
        },
        lastname:{
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
        },
        semNumber:[semesterSchema]
        ,
        reRegistered:{
            type:Boolean,
            default:false
        }

        
},
{timestamps:true}
);

studentSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    const query = this.getQuery();
    
    const oldValues = await this.model.findOne(query);
    
    if ((update.phoneNo != oldValues.phoneNo) && update.phoneNo) {
        update.phoneNo = update.phoneNo;
        console.log("phone number updated");
    }

    if ((update.email !== oldValues.email) && update.email) {
        update.email = update.email;
        console.log("email updated");
    }
    next();
});

const studentModel= mongoose.model("student",studentSchema);
module.exports = {studentModel}