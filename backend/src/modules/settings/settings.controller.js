import { success } from "../../utils/response.js";
import { getAdminProfile, updateAdminProfile, changeAdminPassword, getApplicationSettings, updateApplicationSettings, getNotificationPreferences, updateNotificationPreferences, getSecuritySettings } from "./settings.service.js";

export const getProfileController = async (req, res, next) => {
  try {
    const profile = await getAdminProfile(req.user.userId);
    return success(res, profile, "Admin profile retrieved");
  } catch (err) {
    next(err);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const profile = await updateAdminProfile(req.user.userId, req.body);
    return success(res, profile, "Admin profile updated");
  } catch (err) {
    next(err);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const result = await changeAdminPassword(req.user.userId, req.body);
    return success(res, result, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};

export const getApplicationSettingsController = async (req, res, next) => {
  try {
    const settings = await getApplicationSettings(req.user.userId);
    return success(res, settings, "Application settings retrieved");
  } catch (err) {
    next(err);
  }
};

export const updateApplicationSettingsController = async (req, res, next) => {
  try {
    const settings = await updateApplicationSettings(req.user.userId, req.body);
    return success(res, settings, "Application settings updated");
  } catch (err) {
    next(err);
  }
};

export const getNotificationPreferencesController = async (req, res, next) => {
  try {
    const preferences = await getNotificationPreferences(req.user.userId);
    return success(res, preferences, "Notification preferences retrieved");
  } catch (err) {
    next(err);
  }
};

export const updateNotificationPreferencesController = async (req, res, next) => {
  try {
    const preferences = await updateNotificationPreferences(req.user.userId, req.body);
    return success(res, preferences, "Notification preferences updated");
  } catch (err) {
    next(err);
  }
};

export const getSecuritySettingsController = async (req, res, next) => {
  try {
    const security = await getSecuritySettings(req.user.userId);
    return success(res, security, "Security settings retrieved");
  } catch (err) {
    next(err);
  }
};
