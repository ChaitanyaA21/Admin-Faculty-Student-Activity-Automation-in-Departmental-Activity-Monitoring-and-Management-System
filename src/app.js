// import express from "express";
const express = require('express');
const app=express();
require('dotenv').config();
const connectDB=require('./Admin/DB/connect')
const PORT=process.env.PORT
const subjectObj=require("./Admin/Models/subject.model")


const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
        new subjectObj({subjectId:"SubjectId",subjectName:"subjectName"}).save();

      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)

      );
    } catch (error) {
      console.log(error);
    }

  };
  
  start();