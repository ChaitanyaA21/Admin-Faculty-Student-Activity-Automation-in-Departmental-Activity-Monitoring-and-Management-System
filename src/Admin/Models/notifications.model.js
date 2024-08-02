const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  from: {
    type: String,
    required: [true, "Provide From address"],
  },
  toUserId: {
    type: String,
    required: [true, "Provide userid of whom to send"],
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  message: {
    type: String,
    required: [true, "Provide message to send"],
  },
  branch: {
    type: String,
  },
  academicYear: {
    type: Number,
  },
  semNo: {
    type: Number,
  },
  specialization: {
    type: String,
  },
  hasRead: {
    type: Boolean,
    default: false,
  },
});

notificationSchema.pre("save", async function (next) {
  try {
    const notification = mongoose.model("notification");
    const userId = this.userId;

    // Count the number of posts created by the user
    const notificationCount = await notification.countDocuments({ userId });

    if (notificationCount >= 10) {
      // Find and remove the oldest post
      const oldestNotification = await notification
        .findOne({ userId })
        .sort({ createdAt: 1 });
      if (oldestNotification) {
        await oldestNotification.remove();
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const notification = mongoose.model("notification", notificationSchema);
module.exports = { notification };
