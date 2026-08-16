import User, { ROLES } from "../auth/auth.model.js";
import AdminSettings, { DEFAULT_APPLICATION_SETTINGS, DEFAULT_NOTIFICATION_PREFERENCES } from "./settings.model.js";
import { appError } from "../../utils/appError.js";

function toProfile(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    bio: user.bio || "",
    profileImage: user.profileImage?.url ? { url: user.profileImage.url } : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

// getAdmin verifies that the requested profile belongs to an ADMIN user.
// This prevents a Student from accessing or modifying Admin settings by
// guessing IDs.
async function getUser(userId, projection = "") {
  const user = await User.findById(userId).select(projection);
  if (!user) throw appError("User not found", 404);
  return user;
}

// getOrCreateSettings returns the AdminSettings document for the given user,
// creating it with defaults if it does not yet exist.
async function getOrCreateSettings(userId) {
  return AdminSettings.findOneAndUpdate(
    { admin: userId },
    {
      $setOnInsert: {
        admin: userId,
        application: DEFAULT_APPLICATION_SETTINGS,
        notifications: DEFAULT_NOTIFICATION_PREFERENCES
      }
    },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
  );
}

function toApplicationSettings(settings) {
  return {
    applicationName: settings.application.applicationName,
    timezone: settings.application.timezone,
    dateFormat: settings.application.dateFormat,
    defaultPageSize: settings.application.defaultPageSize
  };
}

function toNotificationPreferences(settings) {
  return {
    emailNotifications: settings.notifications.emailNotifications,
    taskNotifications: settings.notifications.taskNotifications,
    attendanceNotifications: settings.notifications.attendanceNotifications,
    projectNotifications: settings.notifications.projectNotifications,
    systemNotifications: settings.notifications.systemNotifications
  };
}

export const getAdminProfile = async (userId) => {
  const user = await getUser(userId);
  return toProfile(user);
};

export const updateAdminProfile = async (userId, data) => {
  const update = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.bio !== undefined) update.bio = data.bio;
  if (data.email !== undefined) {
    const normalizedEmail = data.email.toLowerCase();
    const existingUser = await User.exists({ _id: { $ne: userId }, email: normalizedEmail });
    if (existingUser) throw appError("A user already exists with this email", 409);
    update.email = normalizedEmail;
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    update,
    { returnDocument: "after", runValidators: true }
  );
  if (!user) throw appError("User not found", 404);
  return toProfile(user);
};

export const changeAdminPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await getUser(userId, "+password");
  if (!await user.comparePassword(currentPassword)) throw appError("Current password is incorrect", 401);
  user.password = newPassword;
  await user.save();
  await AdminSettings.findOneAndUpdate(
    { admin: userId },
    {
      $setOnInsert: {
        admin: userId,
        application: DEFAULT_APPLICATION_SETTINGS,
        notifications: DEFAULT_NOTIFICATION_PREFERENCES
      },
      $set: { "security.passwordChangedAt": new Date() }
    },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
  );
  return { passwordChanged: true };
};

export const getApplicationSettings = async (adminId) => {
  await getUser(adminId);
  const settings = await getOrCreateSettings(adminId);
  return toApplicationSettings(settings);
};

export const updateApplicationSettings = async (adminId, data) => {
  await getUser(adminId);
  const update = {};
  for (const [key, value] of Object.entries(data)) update[`application.${key}`] = value;
  const settings = await AdminSettings.findOneAndUpdate(
    { admin: adminId },
    {
      $setOnInsert: {
        admin: adminId,
        notifications: DEFAULT_NOTIFICATION_PREFERENCES
      },
      $set: update
    },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
  );
  return toApplicationSettings(settings);
};

export const getNotificationPreferences = async (userId) => {
  await getUser(userId);
  const settings = await getOrCreateSettings(userId);
  return toNotificationPreferences(settings);
};

export const updateNotificationPreferences = async (userId, data) => {
  await getUser(userId);
  const update = {};
  for (const [key, value] of Object.entries(data)) update[`notifications.${key}`] = value;
  const settings = await AdminSettings.findOneAndUpdate(
    { admin: userId },
    {
      $setOnInsert: {
        admin: userId,
        application: DEFAULT_APPLICATION_SETTINGS
      },
      $set: update
    },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
  );
  return toNotificationPreferences(settings);
};

export const getSecuritySettings = async (adminId) => {
  const user = await getUser(adminId);
  const settings = await getOrCreateSettings(adminId);
  return {
    accountStatus: "active",
    lastLogin: null,
    passwordChangedAt: settings.security?.passwordChangedAt || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};
