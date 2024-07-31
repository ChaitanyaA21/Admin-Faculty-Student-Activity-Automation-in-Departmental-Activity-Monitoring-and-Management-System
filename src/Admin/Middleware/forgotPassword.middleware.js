const { facultyModel } = require("../Models/faculty.model.js");
const { studentModel } = require("../Models/student.model.js");
const { studentLogin } = require("../Models/studentLogin.model.js");
const { asyncHandler } = require("../Utils/asyncHandler.utils.js");
const { ApiError } = require("../Utils/ApiError.utils.js");
const { emailIt } = require("../Utils/mail.utils.js");
const { ApiResponse } = require("../Utils/ApiResponse.utils.js");
const { facultyLogin } = require("../Models/facultyLogin.model.js");

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, userType } = req.body;
  if (!email) {
    throw new ApiError(404, "Email not given");
  }

  let document, loginDocument;
  if (userType.toLowerCase() === "student") {
    document = await studentModel.findOne(
      { email: email },
      { rollNo: 1, email: 1, firstname: 1, lastname: 1 }
    );

    if (!document) {
      throw new ApiError(404, "Student does not exist");
    }
    loginDocument = await studentLogin.findOne({ rollNo: document?.rollNo });
  } else if (userType.toLowerCase() === "faculty") {
    document = await facultyModel.findOne({ email: email }, { _id: 0 });

    if (!document) {
      throw new ApiError(404, "Faculty record does not exist");
    }
    loginDocument = await facultyLogin.findOne({
      facultyId: document?.facultyId,
    });
  } else {
    throw new ApiError(
      404,
      "User type does not exist, user can either be student or faculty"
    );
  }

  if (!document || !loginDocument) {
    throw new ApiError(404, "User does not exist");
  }
  const resetToken = loginDocument.generateResetToken();
  loginDocument.resetToken = resetToken;
  await loginDocument.save({ validateBeforeSave: false });

  const subject = "Password Reset Request for Your Account";
  // http://localhost:5000/api/v2/password/resetpassword?usertype=${userType}&token=${[resetToken]}

  const text = `Dear ${document?.firstname} ${document?.lastname},

We received a request to reset the password for your account associated with this email address. If you made this request, please click on the link below to reset your password:

http://localhost:5173/resetpassword?usertype=${userType}&token=${[resetToken]}

This link will expire in 30 minutes for security reasons. If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.

Thank you,
JNTU Support Team

Please do not reply to this email. This mailbox is not monitored and you will not receive a response.
`;
  const result = await emailIt(email, subject, text);

  let sentEmail;
  if (result) {
    console.log("sent email successfully");
    sentEmail = true;
  } else {
    console.log("email sending unsuccessful");
    sentEmail = false;
  }

  res
    .status(200)
    .json(new ApiResponse(200, { sentEmail: sentEmail }, "Successfull"));
});

module.exports = { forgotPassword };
