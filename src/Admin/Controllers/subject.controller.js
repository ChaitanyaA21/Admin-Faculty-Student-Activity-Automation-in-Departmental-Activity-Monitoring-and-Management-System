const { subject } = require("../Models/subject.model.js");
//add subjects
const addSubject = async (req, res) => {
  const { subjectId, subjectName, department } = req.body;

  if (!subjectId || !subjectName) {
    return res
      .status(400)
      .json({ error: "subjectId and subjectName are required" });
  }

  try {
    const newSubject = new subject({
      subjectId: subjectId,
      subjectName: subjectName,
      department: department,
    });

    await newSubject.save();

    res
      .status(201)
      .json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete Subjects
const deleteSubjects = async (req, res) => {
  const { department, subjectIds } = req.body;

  if (!department || !subjectIds || !Array.isArray(subjectIds)) {
    return res
      .status(400)
      .json({ error: "Department and subjectIds array are required" });
  }

  try {
    const result = await subject.deleteMany({
      department: department,
      subjectId: { $in: subjectIds },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No subjects found to delete" });
    }

    res
      .status(200)
      .json({ message: "Subjects deleted successfully", result: result });
  } catch (error) {
    console.error("Error deleting subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//View subjects

const viewSubjects = async (req, res) => {
  const { department } = req.body;

  if (!department) {
    return res.status(400).json({ error: "Department is required" });
  }

  try {
    const subjects = await subject.find({ department: department });

    if (subjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for the given department" });
    }

    res.status(200).json({ subjects: subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Update Subject

const updateSubject = async (req, res) => {
  const { department, subjectId, newSubjectId, newSubjectName } = req.body;

  if (!department || !subjectId) {
    return res
      .status(400)
      .json({ error: "Department and subjectId are required" });
  }

  const updateData = {};
  if (newSubjectId) updateData.subjectId = newSubjectId;
  if (newSubjectName) updateData.subjectName = newSubjectName;

  try {
    const updatedSubject = await subject.findOneAndUpdate(
      { department: department, subjectId: subjectId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res
      .status(200)
      .json({
        message: "Subject updated successfully",
        subject: updatedSubject,
      });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addSubject, deleteSubjects, viewSubjects, updateSubject };
