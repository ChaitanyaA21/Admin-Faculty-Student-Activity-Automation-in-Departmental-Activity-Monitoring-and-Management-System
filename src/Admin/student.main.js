const express = require('express');
const app=express();
const studentRegistrationRouter =require('./Routes/student.routes.js')
// const studentRegistrationRoute=require("./Routes/student.routes");

app.use("/student",studentRegistrationRouter)

module.exports  = app
