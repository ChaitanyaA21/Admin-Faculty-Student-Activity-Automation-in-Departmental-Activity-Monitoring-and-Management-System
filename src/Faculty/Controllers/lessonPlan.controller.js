const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { LessonPlan } = require("../../Admin/Models/lessonPlanner.model.js");

// Create a new lesson plan
const createLessonPlan = asyncHandler(async (req, res) => {
  const { subjectName, subjectId, message, date, academicYear } = req.body;

  if (!subjectName || !subjectId || !message || !date || !academicYear) {
    throw new ApiError(
      400,
      "All fields are required: subjectName, subjectId, message, date and academic year"
    );
  }

  const newLessonPlan = await LessonPlan.create({
    subjectName,
    subjectId,
    message,
    date,
    academicYear,
  });
  if (!newLessonPlan) {
    throw new ApiError(
      500,
      "Internal Server Error:Lesson plan couldn't be added"
    );
  }
  res
    .status(201)
    .json(
      new ApiResponse(201, newLessonPlan, "Lesson Plan added successfully")
    );
});

// Get all lesson plans
const getAllLessonPlans = asyncHandler(async (req, res) => {
  const { subjectId, academicYear } = req.body;

  let lessonPlans;
  if (req.user.facultyId) {
    lessonPlans = await LessonPlan.find({
      subjectId,
      academicYear,
    });
  } else {
    lessonPlans = await LessonPlan.find({
      subjectId,
      academicYear: req.userDetails.academicYear,
    });
  }
  if (!lessonPlans) {
    return res.status(200).json(new ApiResponse(200, {}, "No Lessons found"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, lessonPlans, "Lesson Plans retrieved successfully")
    );
});

// Get a single lesson plan by ID
const getLessonPlanById = asyncHandler(async (req, res) => {
  const lessonPlan = await LessonPlan.findById(req.params.id);
  if (!lessonPlan) {
    throw new ApiError(404, "Lesson Plan not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, lessonPlan, "Lesson Plan retrieved successfully")
    );
});

// Update a lesson plan
const updateLessonPlan = asyncHandler(async (req, res) => {
  const { _id, message, date } = req.body;

  const lessonPlan = await LessonPlan.findById(_id);

  if (!lessonPlan) {
    throw new ApiError(404, "Lesson Plan not found");
  }

  lessonPlan.message = message || lessonPlan.message;
  lessonPlan.date = date || lessonPlan.date;

  const updatedLessonPlan = await lessonPlan.save();

  if (!updatedLessonPlan) {
    throw new ApiError(500, "Internal Server Error: Lesson Plan Not Updated");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedLessonPlan,
        "Lesson Plan updated successfully"
      )
    );
});

// Delete a lesson plan
const deleteLessonPlan = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const lessonPlan = await LessonPlan.deleteMany({ _id: { $in: ids } });

  if (!lessonPlan.deletedCount) {
    throw new ApiError(404, "Lesson Plan not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Lesson Plan deleted successfully"));
});

module.exports = {
  createLessonPlan,
  getAllLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan,
};
