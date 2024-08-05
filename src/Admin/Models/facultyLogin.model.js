const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { faculty } = require("./faculty.model");

const facultyLoginSchema = mongoose.Schema({
  facultyId: {
    type: String,
    // ref:"faculty",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  otp: {
    type: Number,
  },
});

facultyLoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

facultyLoginSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
facultyLoginSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      facultyId: this.facultyId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
facultyLoginSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
facultyLoginSchema.methods.generateResetToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.RESET_TOKEN_SECRET,
    {
      expiresIn: process.env.RESET_TOKEN_EXPIRY,
    }
  );
};
facultyLoginSchema.methods.isOTPCorrect = function (otp) {
  return this.otp === otp;
};

const facultyLogin = mongoose.model("facultyLogin", facultyLoginSchema);
module.exports = { facultyLogin };
