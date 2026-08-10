import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const status = z.enum(["todo", "in-progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  projectId: objectId,
  assignedTo: objectId.optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().datetime().optional()
}).strict();

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().datetime().optional(),
  status: status.optional()
}).strict();

export const updateTaskStatusSchema = z.object({ status }).strict();
export const assignTaskSchema = z.object({ userId: objectId }).strict();
