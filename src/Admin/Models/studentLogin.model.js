const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentLoginSchema = mongoose.Schema({
  rollNo: {
    type: String,
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

studentLoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentLoginSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentLoginSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      rollNo: this.rollNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentLoginSchema.methods.generateRefreshToken = function () {
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

studentLoginSchema.methods.generateResetToken = function () {
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

studentLoginSchema.methods.isOTPCorrect = function (otp) {
  return this.otp === otp;
};

const studentLogin = mongoose.model("studentLogin", studentLoginSchema);
module.exports = { studentLogin };
