const mongoose = require("mongoose");

const { Schema } = mongoose;
const NotificationSchema = new Schema(
  {
    notificationFrom: { type: Schema.Types.ObjectId, ref: "User" },
    notificationTo: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    seen: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const Notification = mongoose.model("Notifications", NotificationSchema);

module.exports = Notification;
