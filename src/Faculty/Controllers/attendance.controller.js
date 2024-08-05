// const {
//   marksAndAttendanceModel,
// } = require("../../Admin/Models/marksAndAttendance.model.js");
// const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
// const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
// const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

// const addAttendance = asyncHandler(async (req, res) => {
//   const { presentRollNos, absentRollNos, subjectName, date } = req.body;

//   // prettier-ignore
//   if (Array.isArray(presentRollNos) && Array.isArray(absentRollNos)) {
//       if((!subjectName || !date) || (presentRollNos.length === 0 && absentRollNos.length === 0))
//         throw new ApiError(400, "Client Error: Details are not given")
//   } else {
//     throw new ApiError(400, "Client Error: Given data is not in correct type.")
//   }

//   const normalizeToMidnight = (date) => {
//     const d = new Date(date);
//     d.setUTCHours(0, 0, 0, 0);
//     return d;
//   };

//   const currentDate = normalizeToMidnight(date);

//   let result = [];

//   for (const rollNo of presentRollNos) {
//     const result1 = await marksAndAttendanceModel.findOneAndUpdate(
//       {
//         rollNo: rollNo,
//         subjectName,
//       },
//       {
//         $push: {
//           attendance: {
//             date: currentDate,
//             status: "Present",
//           },
//         },
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       }
//     );
//     if (result1) {
//       console.log("Present roll no given: ", result1.rollNo);
//       result.push(result1);
//     } else console.log("Present roll no not given: ", result1.rollNo);
//   }

//   for (const rollNo of absentRollNos) {
//     const result2 = await marksAndAttendanceModel.findOneAndUpdate(
//       {
//         rollNo: rollNo,
//         subjectName,
//       },
//       {
//         $push: {
//           attendance: {
//             date: currentDate,
//             status: "Absent",
//           },
//         },
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       }
//     );
//     if (result2) {
//       console.log("Present roll no given: ", result2.rollNo);
//       result.push(result2);
//     } else console.log("Present roll no not given: ", result2.rollNo);
//   }

//   res.status(200).json(new ApiResponse(200, result, "successful"));
// });

// const updateAttendance = asyncHandler(async (req, res) => {
//   // const { ids, {  } } = req.body;

//   if (!Array.isArray(ids) || ids.length == 0) {
//     throw new ApiError(404, "Client Error: Correct details are not provided");
//   }

//   // const result =
// });

// module.exports = { addAttendance };

const {
  marksAndAttendanceModel,
} = require("../../Admin/Models/marksAndAttendance.model.js");
const { asyncHandler } = require("../../Admin/Utils/asyncHandler.utils.js");
const { ApiResponse } = require("../../Admin/Utils/ApiResponse.utils.js");
const { ApiError } = require("../../Admin/Utils/ApiError.utils.js");

const addAttendance = asyncHandler(async (req, res) => {
  const { presentRollNos, absentRollNos, subjectName, date } = req.body;

  if (Array.isArray(presentRollNos) && Array.isArray(absentRollNos)) {
    if (
      !subjectName ||
      !date ||
      (presentRollNos.length === 0 && absentRollNos.length === 0)
    ) {
      throw new ApiError(400, "Client Error: Details are not given");
    }
  } else {
    throw new ApiError(400, "Client Error: Given data is not in correct type.");
  }

  const normalizeToMidnight = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  const currentDate = normalizeToMidnight(date);

  let result = [];
  let existingPresentRollNos = [];

  for (const rollNo of presentRollNos) {
    let doc = await marksAndAttendanceModel.findOne({
      rollNo: rollNo,
      subjectName,
    });

    if (!doc) {
      doc = new marksAndAttendanceModel({
        rollNo: rollNo,
        subjectName,
        attendance: [],
        internal: [],
      });
    }

    const existingDates = doc.attendance.map((att) => att.date.toISOString());
    if (existingDates.includes(currentDate.toISOString())) {
      existingPresentRollNos.push(rollNo);
    } else {
      doc.attendance.push({
        date: currentDate,
        status: "Present",
      });

      const savedDoc = await doc.save();
      result.push({ rollNo: savedDoc.rollNo, attendance: savedDoc.attendance });
    }
  }

  for (const rollNo of absentRollNos) {
    let doc = await marksAndAttendanceModel.findOne({
      rollNo: rollNo,
      subjectName,
    });

    if (!doc) {
      doc = new marksAndAttendanceModel({
        rollNo: rollNo,
        subjectName,
        attendance: [],
        internal: [],
      });
    }

    const existingDates = doc.attendance.map((att) => att.date.toISOString());
    if (existingDates.includes(currentDate.toISOString())) {
      throw new ApiError(
        400,
        "Client Error: Attendance for this date already exists."
      );
    }

    doc.attendance.push({
      date: currentDate,
      status: "Absent",
    });

    const savedDoc = await doc.save();
    result.push({ rollNo: savedDoc.rollNo, attendance: savedDoc.attendance });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        savedDocs: result,
        existingPresentRollNos: existingPresentRollNos,
      },
      "successful"
    )
  );
});

module.exports = { addAttendance };
