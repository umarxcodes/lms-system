import { z } from "zod";

const name = z.string({ error: "Name is required" }).trim().min(1, "Name is required").max(80, "Name is too long");
const email = z.string({ error: "Email is required" }).trim().min(1, "Email is required").email("Invalid email address");
const password = z.string({ error: "Password is required" }).min(8, "Password must be at least 8 characters");

export const updateProfileSchema = z.object({
  name: name.optional(),
  email: email.optional()
}).strict().refine((data) => Object.keys(data).length > 0, "At least one profile field is required");

export const changePasswordSchema = z.object({
  currentPassword: z.string({ error: "Current password is required" }).min(1, "Current password is required"),
  newPassword: password,
  confirmPassword: z.string({ error: "Confirm password is required" }).min(1, "Confirm password is required")
}).strict().refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password must match",
  path: ["confirmPassword"]
});

export const updateApplicationSettingsSchema = z.object({
  applicationName: z.string().trim().min(1, "Application name is required").max(80, "Application name is too long").optional(),
  timezone: z.string().trim().min(1, "Timezone is required").max(80, "Timezone is too long").optional(),
  dateFormat: z.enum(["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]).optional(),
  defaultPageSize: z.coerce.number().int().min(1, "Default page size must be at least 1").max(100, "Default page size cannot exceed 100").optional()
}).strict().refine((data) => Object.keys(data).length > 0, "At least one application setting is required");

export const updateNotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  taskNotifications: z.boolean().optional(),
  attendanceNotifications: z.boolean().optional(),
  projectNotifications: z.boolean().optional(),
  systemNotifications: z.boolean().optional()
}).strict().refine((data) => Object.keys(data).length > 0, "At least one notification preference is required");
