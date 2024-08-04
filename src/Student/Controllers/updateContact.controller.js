const { studentModel } = require("../../Admin/Models/student.model.js");
const { studentLogin } = require("../../Admin/Models/studentLogin.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { emailIt } = require("../../Admin/Utils/mail.utils.js");

const updateContact = asyncHandler(async (req, res) => {
  const { newEmail, otp } = req.body;

  if (!newEmail) {
    throw new ApiError(404, "Details Not Provided");
  }

  let result2 = null;

  const student1 = await studentLogin.findOne({ rollNo: req.user.rollNo });
  if (student.isOTPCorrect(otp)) {
    student1.otp = "";
    await student1.save();

    const student2 = await studentModel.findOne({ rollNo: req.user.rollNo });

    if (!student2) {
      res.status(404).json(new ApiResponse(404, {}, "User not found"));
      throw new ApiError(404, "User not found");
    }

    student2.email = newEmail;
    await student2.save();
  } else {
    res.status(400).json(new ApiResponse(400, {}, "Wrong OTP"));
    throw new ApiError(400, "Wrong OTP");
  }

  res.status(200).json(new ApiResponse(200, {}, "Successfull"));
});

const otpGenerate = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "Client Error: Details not Provided"));
    throw new ApiError(400, "Client Error: Details not Provided");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const result1 = await studentModel.findOne(
    { rollNo: req.user.rollNo },
    { email: 1 }
  );

  if (result1.email.trim() === newEmail.trim()) {
    res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "The new email address is the same as the current email address. Please provide a different email address."
        )
      );
    throw new ApiError(400, "User gave existing email id");
  }

  const result2 = await studentLogin.findOneAndUpdate(
    { rollNo: req.user?.rollNo },
    { otp: otp },
    { new: true }
  );

  if (!result2) {
    res.status(500).json(500, "Couldn't Generate OTP");
    throw new ApiError(500, "Couldn't generate OTP");
  }

  const subject = "Your OTP Code for Email Update";

  const text = `<p>Hello ${req.userDetails?.firstname} ${req.userDetails?.lastname},</p>

    <p>We received a request to update the email address associated with your account. To complete this process, please use the OTP (One-Time Password) code provided below:</p>

    <p><strong>OTP Code:</strong> <strong>${otp}</strong></p>

    <p>If you did not request an email update, please ignore this message. For security reasons, never share this code with anyone.</p>

    <p>If you need assistance or have any questions, please contact our support team.</p>

    <p>Thank you,<br>
    JNTUH Support Team</p>
`;

  const result3 = await emailIt(newEmail, subject, text);

  if (!result3) {
    res.status(500).json(500, "Couldn't send email");
    throw new ApiError(500, "Couldn't send email");
  }

  res.status(200).json(new ApiResponse(200, {}, "Succesful"));
});

module.exports = { updateContact, otpGenerate };
