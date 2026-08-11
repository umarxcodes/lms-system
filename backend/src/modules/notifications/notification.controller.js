import { createAnnouncement, getUserNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "./notification.service.js";
import { success } from "../../utils/response.js";

export const createAnnouncementController = async (req, res, next) => {
  try {
    const notifications = await createAnnouncement(req.body);
    return success(res, { count: notifications.length }, "Announcement sent", 201);
  } catch (err) {
    next(err);
  }
};

export const getMyNotificationsController = async (req, res, next) => {
  try {
    return success(res, await getUserNotifications(req.user.userId, req.validatedQuery));
  } catch (err) {
    next(err);
  }
};

export const getUnreadNotificationsController = async (req, res, next) => {
  try {
    return success(res, await getUserNotifications(req.user.userId, req.validatedQuery, true));
  } catch (err) {
    next(err);
  }
};

export const getUnreadNotificationCountController = async (req, res, next) => {
  try {
    return success(res, { count: await getUnreadNotificationCount(req.user.userId) });
  } catch (err) {
    next(err);
  }
};

export const markNotificationAsReadController = async (req, res, next) => {
  try {
    return success(res, await markNotificationAsRead(req.params.id, req.user.userId), "Notification marked as read");
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsAsReadController = async (req, res, next) => {
  try {
    return success(res, await markAllNotificationsAsRead(req.user.userId), "Notifications marked as read");
  } catch (err) {
    next(err);
  }
};

export const deleteNotificationController = async (req, res, next) => {
  try {
    await deleteNotification(req.params.id, req.user.userId);
    return success(res, null, "Notification deleted");
  } catch (err) {
    next(err);
  }
};
