// import express from "express";
const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./Admin/DB/connect");
const {
  verifyJWT,
  verifyJWTFaculty,
} = require("./Admin/Middleware/auth.middleware.js");

const uploadRoute = require("./Admin/Routes/files.routes.js");

const PORT = process.env.PORT || 5000;

// const subjectObj=require("./Admin/Models/subject.model")

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import admin routes
const adminLogin = require("./Admin/Routes/admin.routes.js");
const passwordRouter = require("./Admin/Routes/password.routes.js");
const studentRegistrationRouter = require("./Admin/Routes/student.routes.js");
const facultyRegistrationRouter = require("./Admin/Routes/faculty.routes.js");
const subjectRouter = require("./Admin/Routes/subject.routes.js");
const semesterRouter = require("./Admin/Routes/semester.routes.js");
//import faculty routes
const facultyRouter = require("./Faculty/Routes/routes.js");
//import student routes
const studentRouter = require("./Student/Routes/routes.js");

//Routes DeClaration
app.use("/api/v2", adminLogin);
app.use("/api/v2/password", passwordRouter);
app.use("/api/v2/student", studentRegistrationRouter);
app.use("/api/v2/faculty", facultyRegistrationRouter);
app.use("/api/v2/subject", subjectRouter);
app.use("/api/v2/semester", semesterRouter);

//faculty routes declaration

app.use("/api/v2/faculty/login", [verifyJWTFaculty, facultyRouter]);

//student routes declaration

app.use("/api/v2/student/login", [verifyJWT, studentRouter]);

//forms router
app.use("/api/v2", uploadRoute);

//Server and DataBase connection
const start = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await connectDB();

    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
