import mongoose from "mongoose";

export const DEFAULT_APPLICATION_SETTINGS = Object.freeze({
  applicationName: "Bootcamp LMS",
  timezone: "Asia/Karachi",
  dateFormat: "YYYY-MM-DD",
  defaultPageSize: 20
});

export const DEFAULT_NOTIFICATION_PREFERENCES = Object.freeze({
  emailNotifications: true,
  taskNotifications: true,
  attendanceNotifications: true,
  projectNotifications: true,
  systemNotifications: true
});

const settingsSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  application: {
    applicationName: { type: String, trim: true, default: DEFAULT_APPLICATION_SETTINGS.applicationName },
    timezone: { type: String, trim: true, default: DEFAULT_APPLICATION_SETTINGS.timezone },
    dateFormat: { type: String, enum: ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"], default: DEFAULT_APPLICATION_SETTINGS.dateFormat },
    defaultPageSize: { type: Number, min: 1, max: 100, default: DEFAULT_APPLICATION_SETTINGS.defaultPageSize }
  },
  notifications: {
    emailNotifications: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.emailNotifications },
    taskNotifications: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.taskNotifications },
    attendanceNotifications: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.attendanceNotifications },
    projectNotifications: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.projectNotifications },
    systemNotifications: { type: Boolean, default: DEFAULT_NOTIFICATION_PREFERENCES.systemNotifications }
  },
  security: {
    passwordChangedAt: { type: Date }
  }
}, { timestamps: true });

settingsSchema.index({ admin: 1 }, { unique: true });

export default mongoose.models.AdminSettings || mongoose.model("AdminSettings", settingsSchema);
