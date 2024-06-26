const {semester}=require("../Models/semester.model.js")

//add Semester
const addSemester = async (req, res) => {
    const { branch, specialization, year, semNo, subjects } = req.body;

    if (!branch || !year || !semNo || !subjects || !Array.isArray(subjects)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const newSemester = new semester({
        branch: branch,
        specialization: specialization,
        year: year,
        semNo: semNo,
        subjects: subjects
    });

    try {
        const savedSemester = await newSemester.save();
        res.status(201).json({ message: 'Semester added successfully', semester: savedSemester });
    } catch (error) {
        console.error('Error adding semester:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//delete semester
const deleteSemester = async (req, res) => {
    const { branch, year, semNo, specialization } = req.body;

    if (!branch || !year || !semNo) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        let filter = {
            branch: branch,
            year: year,
            semNo: semNo
        };

        if (specialization) {
            filter.specialization = specialization;
        }

        const result = await semester.deleteOne(filter);

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Semester deleted successfully' });
        } else {
            res.status(404).json({ error: 'Semester not found' });
        }
    } catch (error) {
        console.error('Error deleting semester:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//view semester
const viewSemester = async (req, res) => {
    const { branch, specialization, year } = req.body;

    if (!branch || !year) {
        return res.status(400).json({ error: 'Branch and year are required' });
    }

    try {
        let filter = {
            branch: branch,
            year: year
        };

        if (specialization) {
            filter.specialization = specialization;
        }

        const semesters = await semester.find(filter);

        if (semesters.length > 0) {
            res.status(200).json({ semesters: semesters });
        } else {
            res.status(404).json({ error: 'No semesters found' });
        }
    } catch (error) {
        console.error('Error fetching semester details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Update semester
const updateSemester = async (req, res) => {
    const { oldBranch, newBranch, oldSpecialization, newSpecialization, oldYear, newYear, oldSemNo, newSemNo, subjectsToRemove, subjectsToAdd } = req.body;

    if (!oldBranch || !oldYear || !oldSemNo) {
        return res.status(400).json({ error: 'Old branch, year, and semNo are required' });
    }

    try {
        let filter = {
            branch: oldBranch,
            year: oldYear,
            semNo: oldSemNo
        };

        if (oldSpecialization) {
            filter.specialization = oldSpecialization;
        }

        let updateFields = {};

        if (newBranch) {
            updateFields.branch = newBranch;
        }
        if (newSpecialization) {
            updateFields.specialization = newSpecialization;
        }
        if (newYear) {
            updateFields.year = newYear;
        }
        if (newSemNo) {
            updateFields.semNo = newSemNo;
        }

        if (subjectsToRemove && subjectsToRemove.length > 0) {
            updateFields.$pullAll = { subjects: subjectsToRemove };
        }

        const result1 = await semester.updateOne(filter, updateFields);

        updateFields = {};

        if (subjectsToAdd && subjectsToAdd.length > 0) {
            updateFields.$push = { subjects: { $each: subjectsToAdd } };
        }

        const result = await semester.updateOne(filter, updateFields);

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Semester updated successfully' });
        } else {
            res.status(404).json({ error: 'Semester not found or no changes were made' });
        }
    } catch (error) {
        console.error('Error updating semester details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { addSemester,deleteSemester,viewSemester,updateSemester};
