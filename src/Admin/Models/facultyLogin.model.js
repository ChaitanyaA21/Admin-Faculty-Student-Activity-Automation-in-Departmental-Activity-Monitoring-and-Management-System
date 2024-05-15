const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const facultyLoginSchema=mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"faculty",
        required:true
    },
    password:{
        type:String,
        required:true,
        
    },
    refreshToken:{
        type:String
    }
   
});

facultyLoginSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

facultyLoginSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
facultyLoginSchema.methods.generateAccessToken =function () { 
    jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
 }
facultyLoginSchema.methods.generateRefreshToken =function () {  
    jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
const facultyLogin=mongoose.model("facultyLogin",facultyLoginSchema);
module.exports = facultyLogin;