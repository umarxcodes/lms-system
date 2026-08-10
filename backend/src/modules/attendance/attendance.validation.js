import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const status = z.enum(["present", "absent", "leave", "late"]);
const attendanceDate = z.string().refine(
  (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isNaN(Date.parse(value)),
  "Date must use YYYY-MM-DD or a valid ISO date-time"
);

export const markAttendanceSchema = z.object({
  studentId: objectId,
  date: attendanceDate,
  status,
  notes: z.string().optional()
}).strict();

export const updateAttendanceSchema = z.object({
  date: attendanceDate.optional(),
  status: status.optional(),
  notes: z.string().optional()
}).strict();

export const attendanceQuerySchema = z.object({
  studentId: objectId.optional(),
  status: status.optional(),
  date: attendanceDate.optional(),
  startDate: attendanceDate.optional(),
  endDate: attendanceDate.optional()
}).strict();
