const { workShop } = require("../../Admin/Models/workshop.model.js");
const {
  curricularActivities,
} = require("../../Admin/Models/curricularActivities.model.js");
const { project } = require("../../Admin/Models/projects.model.js");
const { internship } = require("../../Admin/Models/internship.model.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { uploadOnCloudinary } = require("../../Admin/Utils/cloudinary.utils.js");

const addMyActivity = asyncHandler(async (req, res) => {
  const {
    title, // needed for all (consider this as company name for internship)
    message, // needed for all (consider this as domain for internship)
    place, // needed for workshop and internship
    date, // needed for curricular activities and workshop
    facultyId, // needed for project
    timeperiod, // Number of months internship done
    isActive, // Number of months internship done
  } = req.body;

  const { type } = req.params;

  // Checking if student or faculty
  let data = {};

  // Checking if any file is present and uploading it
  let fileUrl;
  if (req.file) {
    fileUrl = await uploadOnCloudinary(req.file.path);

    if (!fileUrl) {
      throw new ApiError(500, "Failed to upload file to Cloudinary");
    }
    data.certificateUrl = fileUrl;
  }

  // Doing the main work of creating document
  let record,
    result = {};
  if (title && message) {
    data = {
      ...data,
      title,
      message,
    };

    if (place && date) {
      data = {
        ...data,
        place,
        date: Date(date.split("").reverse().join("")),
      };

      if (type === "workshop") {
        let userId;
        if (req.user.rollNo) {
          userId = req.user.rollNo;
        } else if (req.user.facultyId) {
          userId = req.user.facultyId;
        }

        data = {
          ...data,
          userId,
        };
        record = await workShop.create(data);
      } else if (type === "curricular-activities" && req.user.rollNo) {
        data.rollNo = req.user.rollNo;
        record = await curricularActivities.create(data);
      }

      result = {
        title: record?.title,
        message: record?.message,
        place: record?.place,
        date: record?.date,
      };
    } else if (type === "project" && req.user.rollNo && facultyId) {
      data.rollNo = req.user.rollNo;
      data = {
        ...data,
        guide: facultyId,
      };
      record = await project.create(data);

      result = {
        title: record?.title,
        message: record?.message,
      };
    } else if (
      type === "internship" &&
      req.user.rollNo &&
      isActive &&
      timeperiod
    ) {
      data = {
        rollNo: req.user.rollNo,
        companyName: title,
        Domain: message,
        isActive,
        timeperiod,
      };
      record = await internship.create(data);
      result = {
        title: record?.companyName,
        message: record?.Domain,
        isActive: record?.isActive,
        timeperiod: record?.timeperiod,
      };
    } else {
      throw new ApiError(
        404,
        "Client Error: Params or details are not provided yet"
      );
    }
  } else {
    throw new ApiError(404, "Title and Message are not provided");
  }

  if (!record) {
    throw new ApiError(500, "Internal Server Error: Record not created");
  }

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

const viewActivity = asyncHandler(async (req, res) => {
  let query = {};

  const { type } = req.params;

  if (type === "workshop" && req.user?.rollNo) {
    query.userId = req.user.rollNo;
  } else if (type === "workshop" && req.user?.facultyId) {
    query.userId = req.user.facultyId;
  } else if (type) {
    query.rollNo = req.user.rollNo;
  } else {
    throw new ApiError(404, "Client Error: Wrong User");
  }

  let result;
  if (type === "workshop") result = await workShop.findOne(query);
  else if (type === "internship") result = await internship.findOne(query);
  else if (type === "curricular-activities")
    result = await curricularActivities.findOne(query);
  else if (type === "project") result = await project.findOne(query);

  if (!result)
    throw new ApiError(500, "Internal Server Error: No details found");

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

const deleteActivity = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  const { type } = req.params;

  // if (type === "workshop" && req.user?.rollNo) {
  //   query.userId = req.user.rollNo;
  // } else if (type === "workshop" && req.user?.facultyId) {
  //   query.userId = req.user.facultyId;
  // } else if (type) {
  //   query.rollNo = req.user.rollNo;
  // } else {
  //   throw new ApiError(404, "Client Error: Wrong User");
  // }

  let result;
  if (type === "workshop")
    result = await workShop.deleteMany({ _id: { $in: ids } });
  else if (type === "internship")
    result = await internship.deleteMany({ _id: { $in: ids } });
  else if (type === "curricular-activities")
    result = await curricularActivities.deleteMany({ _id: { $in: ids } });
  else if (type === "project")
    result = await project.deleteMany({ _id: { $in: ids } });

  if (!result.deletedCount)
    throw new ApiError(500, "Internal Server Error: No details found");

  res.status(200).json(new ApiResponse(200, result, "Successful"));
});

module.exports = { addMyActivity, viewActivity, deleteActivity };
