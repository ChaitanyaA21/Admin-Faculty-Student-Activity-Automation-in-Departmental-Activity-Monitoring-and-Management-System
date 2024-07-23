const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path given");
      return null;
    }

    console.log("Uploading file to cloudinary");
    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Upload failed:", error);
        } else {
          console.log("Upload successful:", result);
        }
      }
    );

    if (response) {
      console.log("File uploaded successfully on cloudinary");
      console.log("Cloudinary URL: ", response.url);
      return response;
    }
  } catch (error) {
    return null;
  }
};

module.exports = { uploadOnCloudinary };
