import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const date = z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date");

export const attendanceReportQuerySchema = z.object({
  studentId: objectId.optional(),
  status: z.enum(["present", "absent", "leave", "late"]).optional(),
  date: date.optional(),
  startDate: date.optional(),
  endDate: date.optional()
}).strict();

export const assignmentReportQuerySchema = z.object({
  projectId: objectId.optional(),
  assignedTo: objectId.optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional()
}).strict();
