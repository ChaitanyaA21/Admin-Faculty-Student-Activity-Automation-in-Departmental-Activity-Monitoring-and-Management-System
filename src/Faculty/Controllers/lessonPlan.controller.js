const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const LessonPlan = require("../models/lessonPlanner.model.js");

// Create a new lesson plan
const createLessonPlan = asyncHandler(async (req, res) => {
  const { subjectName, subjectId, message, date } = req.body;

  console.log("entered");

  if (!subjectName || !subjectId || !message || !date) {
    throw new ApiError(
      400,
      "All fields are required: subjectName, subjectId, message, and date"
    );
  }

  const newLessonPlan = await LessonPlan.create({
    subjectName,
    subjectId,
    message,
    date,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newLessonPlan, "Lesson Plan added successfully")
    );
});

// Get all lesson plans
const getAllLessonPlans = asyncHandler(async (req, res) => {
  const lessonPlans = await LessonPlan.find();
  res
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
  const { subjectName, subjectId, message, date } = req.body;
  const lessonPlan = await LessonPlan.findById(req.params.id);

  if (!lessonPlan) {
    throw new ApiError(404, "Lesson Plan not found");
  }

  lessonPlan.subjectName = subjectName || lessonPlan.subjectName;
  lessonPlan.subjectId = subjectId || lessonPlan.subjectId;
  lessonPlan.message = message || lessonPlan.message;
  lessonPlan.date = date || lessonPlan.date;

  const updatedLessonPlan = await lessonPlan.save();

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
  const lessonPlan = await LessonPlan.findById(req.params.id);

  if (!lessonPlan) {
    throw new ApiError(404, "Lesson Plan not found");
  }

  await lessonPlan.remove();

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
