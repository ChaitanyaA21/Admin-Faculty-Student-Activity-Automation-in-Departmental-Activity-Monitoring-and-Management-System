const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const LessonPlan = require("../../Admin/Models/lessonPlanner.model.js"); // Import the model

const createLessonPlan = asyncHandler(async (req, res) => {
  const { subjectName, subjectId, message, date } = req.body;

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

  res.status(201).json(
    new ApiResponse(
      201,
      {
        message: newLessonPlan.message,
        date: newLessonPlan.date,
      },
      "Lesson Plan added successfully"
    )
  );
});

module.exports = { createLessonPlan };
