const mongoose = require("mongoose");
const DB_NAME = require("../../constants");
const { ApiError } = require("../Utils/ApiError.utils.js");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("Connected to Database");
  } catch (error) {
    console.log("MongoDB Connection Error...");
    throw new ApiError(500, error.message);
  }
};

module.exports = connectDB;
