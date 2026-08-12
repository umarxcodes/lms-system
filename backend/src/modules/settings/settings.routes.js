import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { updateProfileSchema, changePasswordSchema, updateApplicationSettingsSchema, updateNotificationPreferencesSchema } from "./settings.validation.js";
import { getProfileController, updateProfileController, changePasswordController, getApplicationSettingsController, updateApplicationSettingsController, getNotificationPreferencesController, updateNotificationPreferencesController, getSecuritySettingsController } from "./settings.controller.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });
  req.body = result.data;
  return next();
};

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get("/profile", getProfileController);
router.patch("/profile", validate(updateProfileSchema), updateProfileController);
router.patch("/password", validate(changePasswordSchema), changePasswordController);
router.get("/application", getApplicationSettingsController);
router.patch("/application", validate(updateApplicationSettingsSchema), updateApplicationSettingsController);
router.get("/notifications", getNotificationPreferencesController);
router.patch("/notifications", validate(updateNotificationPreferencesSchema), updateNotificationPreferencesController);
router.get("/security", getSecuritySettingsController);

export default router;
