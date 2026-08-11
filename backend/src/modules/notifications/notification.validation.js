import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const type = z.enum(["ANNOUNCEMENT", "ASSIGNMENT", "QUIZ", "PROJECT"]);

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: type.optional()
}).strict();

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(2).max(160),
  message: z.string().trim().min(1).max(2000),
  recipientIds: z.array(objectId).min(1).max(500)
}).strict();
