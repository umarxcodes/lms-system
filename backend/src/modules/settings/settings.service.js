import User, { ROLES } from "../auth/auth.model.js";
import AdminSettings, { DEFAULT_APPLICATION_SETTINGS, DEFAULT_NOTIFICATION_PREFERENCES } from "./settings.model.js";
import { appError } from "../../utils/appError.js";

function toProfile(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage?.url ? { url: user.profileImage.url } : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function getAdmin(adminId, projection = "") {
  const admin = await User.findOne({ _id: adminId, role: ROLES.ADMIN }).select(projection);
  if (!admin) throw appError("Admin not found", 404);
  return admin;
}

async function getOrCreateSettings(adminId) {
  return AdminSettings.findOneAndUpdate(
    { admin: adminId },
    {
      $setOnInsert: {
        admin: adminId,
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

export const getAdminProfile = async (adminId) => {
  const admin = await getAdmin(adminId);
  return toProfile(admin);
};

export const updateAdminProfile = async (adminId, data) => {
  const update = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) {
    const normalizedEmail = data.email.toLowerCase();
    const existingUser = await User.exists({ _id: { $ne: adminId }, email: normalizedEmail });
    if (existingUser) throw appError("A user already exists with this email", 409);
    update.email = normalizedEmail;
  }

  const admin = await User.findOneAndUpdate(
    { _id: adminId, role: ROLES.ADMIN },
    update,
    { returnDocument: "after", runValidators: true }
  );
  if (!admin) throw appError("Admin not found", 404);
  return toProfile(admin);
};

export const changeAdminPassword = async (adminId, { currentPassword, newPassword }) => {
  const admin = await getAdmin(adminId, "+password");
  if (!await admin.comparePassword(currentPassword)) throw appError("Current password is incorrect", 401);
  admin.password = newPassword;
  await admin.save();
  await AdminSettings.findOneAndUpdate(
    { admin: adminId },
    {
      $setOnInsert: {
        admin: adminId,
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
  await getAdmin(adminId);
  const settings = await getOrCreateSettings(adminId);
  return toApplicationSettings(settings);
};

export const updateApplicationSettings = async (adminId, data) => {
  await getAdmin(adminId);
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

export const getNotificationPreferences = async (adminId) => {
  await getAdmin(adminId);
  const settings = await getOrCreateSettings(adminId);
  return toNotificationPreferences(settings);
};

export const updateNotificationPreferences = async (adminId, data) => {
  await getAdmin(adminId);
  const update = {};
  for (const [key, value] of Object.entries(data)) update[`notifications.${key}`] = value;
  const settings = await AdminSettings.findOneAndUpdate(
    { admin: adminId },
    {
      $setOnInsert: {
        admin: adminId,
        application: DEFAULT_APPLICATION_SETTINGS
      },
      $set: update
    },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
  );
  return toNotificationPreferences(settings);
};

export const getSecuritySettings = async (adminId) => {
  const admin = await getAdmin(adminId);
  const settings = await getOrCreateSettings(adminId);
  return {
    accountStatus: "active",
    lastLogin: null,
    passwordChangedAt: settings.security?.passwordChangedAt || null,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  };
};
