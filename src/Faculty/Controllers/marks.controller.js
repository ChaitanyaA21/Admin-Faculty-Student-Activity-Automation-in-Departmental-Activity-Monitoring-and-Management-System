const { studentModel } = require('../../Admin/Models/student.model.js');

const updateInternalMarks = async (req, res) => {
    const { semNo, subjectName, internalMarksValue, studentMarks } = req.body;

    if (!semNo || !subjectName || !internalMarksValue || !studentMarks) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const internalField = internalMarksValue === 1 ? 'internalOne' : 'internalTwo';

    try {
        for (const [rollNo, marks, assignment, presentation] of studentMarks) {
            const updatePath = `semNumber.$[semIndex].subjects.${subjectName}.marks.${internalField}`;

            const updateData = {
                [`${updatePath}.marks`]: marks,
                [`${updatePath}.assignment`]: assignment,
                [`${updatePath}.presentation`]: presentation
            };

            const result = await studentModel.updateOne(
                { 
                    rollNo: rollNo,
                    'semNumber.semNo': semNo
                },
                { $set: updateData},
                {
                    arrayFilters: [{ 'semIndex.semNo': semNo }]
                }
            );

            console.log(result)
        }

        res.status(200).json({ message: 'Internal marks updated successfully' });
    } catch (error) {
        console.error('Error updating internal marks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { updateInternalMarks };
