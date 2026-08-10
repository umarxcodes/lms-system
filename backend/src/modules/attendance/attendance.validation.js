import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const status = z.enum(["present", "absent", "leave", "late"]);

export const markAttendanceSchema = z.object({
  studentId: objectId,
  date: z.string().datetime(),
  status,
  notes: z.string().optional()
}).strict();

export const updateAttendanceSchema = z.object({
  date: z.string().datetime().optional(),
  status: status.optional(),
  notes: z.string().optional()
}).strict();
