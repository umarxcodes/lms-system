import mongoose from "mongoose";
import Notification, { NOTIFICATION_TYPES } from "./notification.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label) {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

function assertNotificationPayload({ recipient, type, title, message, relatedEntity, relatedEntityId }) {
  assertObjectId(recipient, "Recipient id");
  if (!Object.values(NOTIFICATION_TYPES).includes(type)) throw appError("Notification type is invalid", 400);
  if (!title?.trim() || !message?.trim()) throw appError("Notification title and message are required", 400);
  if ((relatedEntity && !relatedEntityId) || (!relatedEntity && relatedEntityId)) {
    throw appError("Related entity and related entity id must be provided together", 400);
  }
  if (relatedEntity && !["Project", "Task"].includes(relatedEntity)) throw appError("Related entity is invalid", 400);
  if (relatedEntityId) assertObjectId(relatedEntityId, "Related entity id");
}

export const createNotification = async (payload) => {
  assertNotificationPayload(payload);
  return Notification.create(payload);
};

export const createNotifications = async ({ recipientIds, type, title, message, relatedEntity, relatedEntityId }) => {
  const uniqueRecipientIds = [...new Set(recipientIds.map(String))];
  if (!uniqueRecipientIds.length) return [];
  uniqueRecipientIds.forEach((recipient) => assertNotificationPayload({ recipient, type, title, message, relatedEntity, relatedEntityId }));
  return Notification.insertMany(uniqueRecipientIds.map((recipient) => ({ recipient, type, title, message, relatedEntity, relatedEntityId })));
};

export const createAnnouncement = async ({ recipientIds, title, message }) => {
  const uniqueRecipientIds = [...new Set(recipientIds.map(String))];
  const studentCount = await User.countDocuments({ _id: { $in: uniqueRecipientIds }, role: ROLES.STUDENT });
  if (studentCount !== uniqueRecipientIds.length) throw appError("Announcements can only be sent to existing Student users", 400);
  return createNotifications({ recipientIds: uniqueRecipientIds, type: NOTIFICATION_TYPES.ANNOUNCEMENT, title, message });
};

export const getUserNotifications = async (userId, { page = 1, limit = 20, type } = {}, unreadOnly = false) => {
  assertObjectId(userId, "Authenticated user id");
  const query = { recipient: userId, ...(unreadOnly ? { isRead: false } : {}), ...(type ? { type } : {}) };
  const [items, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Notification.countDocuments(query)
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getUnreadNotificationCount = async (userId) => {
  assertObjectId(userId, "Authenticated user id");
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

export const markNotificationAsRead = async (id, userId) => {
  assertObjectId(id, "Notification id");
  assertObjectId(userId, "Authenticated user id");
  const notification = await Notification.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true, runValidators: true });
  if (!notification) throw appError("Notification not found", 404);
  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  assertObjectId(userId, "Authenticated user id");
  const result = await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  return { count: result.modifiedCount };
};

export const deleteNotification = async (id, userId) => {
  assertObjectId(id, "Notification id");
  assertObjectId(userId, "Authenticated user id");
  const notification = await Notification.findOneAndDelete({ _id: id, recipient: userId });
  if (!notification) throw appError("Notification not found", 404);
  return notification;
};
