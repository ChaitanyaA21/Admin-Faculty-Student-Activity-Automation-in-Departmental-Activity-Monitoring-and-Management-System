// import express from "express";
const express = require('express');
const app=express();

require('dotenv').config();
const cors = require('cors')
const cookieParser =require('cookie-parser')

const connectDB=require('./Admin/DB/connect')
const PORT=process.env.PORT
// const subjectObj=require("./Admin/Models/subject.model")

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
const studentRegistrationRouter =require('./Admin/Routes/student.routes.js')
const facultyRegistrationRouter =require('./Admin/Routes/faculty.routes.js')


//Routes DeClaration
app.use("/api/v2/student",studentRegistrationRouter)
app.use("/api/v2/faculty",facultyRegistrationRouter)


//Server and DataBase connection 
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
        // new subjectObj({subjectId:"SubjectId",subjectName:"subjectName"}).save();
        console.log("Connected to Database")

      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)

      );
    } catch (error) {
      console.log(error);
    }

  };
  
start();