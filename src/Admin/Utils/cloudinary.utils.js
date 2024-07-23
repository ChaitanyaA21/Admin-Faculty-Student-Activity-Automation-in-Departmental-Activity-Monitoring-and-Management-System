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
      console.log("No file path provided.");
      return null;
    }

    // Uploading  file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // URL
    const fileUrl = response.secure_url || response.url;
    console.log("File URL:", fileUrl);

    // Checking  URL validity
    const { default: fetch } = await import("node-fetch");

    try {
      const urlResponse = await fetch(fileUrl);
      if (urlResponse.ok) {
        console.log("URL is accessible.");
      } else {
        console.log("URL is not accessible. Status code:", urlResponse.status);
      }
    } catch (fetchError) {
      console.error("Error fetching the URL:", fetchError.message);
    }

    //deleting local file
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      } else {
        console.log("File does not exist, cannot delete:", localFilePath);
      }
    } catch (fsError) {
      console.error("Error deleting file:", fsError.message);
    }
    return response;
  } catch (error) {
    console.error("Upload error:", error.message);

    // If upload failed
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted after error:", localFilePath);
      }
    } catch (fsError) {
      console.error(
        "Error deleting local file after upload error:",
        fsError.message
      );
    }

    return null;
  }
};

module.exports = { uploadOnCloudinary };
