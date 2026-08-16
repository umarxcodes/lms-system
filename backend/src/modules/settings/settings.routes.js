import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadSingleProfileImage } from "../../middlewares/upload.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { updateProfileSchema, changePasswordSchema, updateApplicationSettingsSchema, updateNotificationPreferencesSchema } from "./settings.validation.js";
import { getProfileController, updateProfileController, changePasswordController, getApplicationSettingsController, updateApplicationSettingsController, getNotificationPreferencesController, updateNotificationPreferencesController, getSecuritySettingsController, uploadAdminProfileImageController, deleteAdminProfileImageController } from "./settings.controller.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });
  req.body = result.data;
  return next();
};

const router = express.Router();

router.use(authenticate);

router.get("/profile", requireRole(ROLES.ADMIN, ROLES.STUDENT), getProfileController);
router.patch("/profile", requireRole(ROLES.ADMIN, ROLES.STUDENT), validate(updateProfileSchema), updateProfileController);
router.post("/profile/avatar", requireRole(ROLES.ADMIN, ROLES.STUDENT), uploadSingleProfileImage, uploadAdminProfileImageController);
router.delete("/profile/avatar", requireRole(ROLES.ADMIN, ROLES.STUDENT), deleteAdminProfileImageController);
router.patch("/password", requireRole(ROLES.ADMIN, ROLES.STUDENT), validate(changePasswordSchema), changePasswordController);
router.get("/application", requireRole(ROLES.ADMIN), getApplicationSettingsController);
router.patch("/application", requireRole(ROLES.ADMIN), validate(updateApplicationSettingsSchema), updateApplicationSettingsController);
router.get("/notifications", requireRole(ROLES.ADMIN, ROLES.STUDENT), getNotificationPreferencesController);
router.patch("/notifications", requireRole(ROLES.ADMIN, ROLES.STUDENT), validate(updateNotificationPreferencesSchema), updateNotificationPreferencesController);
router.get("/security", requireRole(ROLES.ADMIN), getSecuritySettingsController);

export default router;
