import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { notificationQuerySchema, createAnnouncementSchema } from "./notification.validation.js";
import { createAnnouncementController, getMyNotificationsController, getUnreadNotificationsController, getUnreadNotificationCountController, markNotificationAsReadController, markAllNotificationsAsReadController, deleteNotificationController } from "./notification.controller.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });
  req.body = result.data;
  return next();
};

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });
  req.validatedQuery = result.data;
  return next();
};

const router = express.Router();

router.post("/announcements", authenticate, requireRole(ROLES.ADMIN), validate(createAnnouncementSchema), createAnnouncementController);
router.get("/me", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), validateQuery(notificationQuerySchema), getMyNotificationsController);
router.get("/unread/count", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), getUnreadNotificationCountController);
router.get("/unread", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), validateQuery(notificationQuerySchema), getUnreadNotificationsController);
router.patch("/read-all", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), markAllNotificationsAsReadController);
router.patch("/:id/read", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), markNotificationAsReadController);
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), deleteNotificationController);

export default router;
