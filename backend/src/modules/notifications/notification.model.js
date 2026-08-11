import mongoose from "mongoose";

export const NOTIFICATION_TYPES = Object.freeze({
  ANNOUNCEMENT: "ANNOUNCEMENT",
  ASSIGNMENT: "ASSIGNMENT",
  QUIZ: "QUIZ",
  PROJECT: "PROJECT"
});

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: Object.values(NOTIFICATION_TYPES), required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  relatedEntity: { type: String, enum: ["Project", "Task"] },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
