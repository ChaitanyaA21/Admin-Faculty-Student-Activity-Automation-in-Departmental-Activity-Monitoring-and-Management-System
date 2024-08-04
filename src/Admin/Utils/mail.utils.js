const nodemailer = require("nodemailer");
const { asyncHandler } = require("./asyncHandler.utils");
const { ApiError } = require("./ApiError.utils");
require("dotenv").config();

const emailIt = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const senderDetails = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: subject,
    html: text,
  };

  const info = await transporter.sendMail(senderDetails);

  if (!info) {
    throw new ApiError(500, "Internal Server Error: could not send mail");
  }

  return info;
};

module.exports = { emailIt };
