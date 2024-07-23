const multer = require("multer");
const path = require("path");

// File type validation function
const fileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "D:\\MYFOLDER\\Mca\\MCA2022-2024\\Project-Sem-4\\Automation_Project\\public\\forms"
    );
  },
  filename: function (req, file, cb) {
    // For unique fileNames adding timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = { upload };
