import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  projectId: z.string(),
  assignedTo: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().datetime().optional()
});
