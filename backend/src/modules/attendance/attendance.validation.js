import { z } from "zod";

export const markAttendanceSchema = z.object({
  studentId: z.string(),
  date: z.string().datetime(),
  status: z.enum(["present", "absent", "late"]),
  notes: z.string().optional()
});
