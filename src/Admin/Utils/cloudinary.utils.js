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
          console.error("Upload failed");
        } else {
          console.log("Upload successful");
        }
      }
    );

    if (response) {
      return response;
    }
  } catch (error) {
    return null;
  }
};
const deleteFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
