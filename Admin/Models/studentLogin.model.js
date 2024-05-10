const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const studentLoginSchema=mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student",
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

studentLoginSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

studentLoginSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
studentLoginSchema.methods.generateAccessToken =function () { 
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
studentLoginSchema.methods.generateRefreshToken =function () {  
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
const studentLogin=mongoose.model("studentLogin",studentLoginSchema);
module.exports = studentLogin;