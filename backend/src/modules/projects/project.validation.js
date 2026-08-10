import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const status = z.enum(["pending", "in-progress", "completed"]);

export const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  teamId: objectId,
  deadline: z.string().datetime().optional()
}).strict();

export const updateProjectSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  status: status.optional()
}).strict();

export const updateProjectStatusSchema = z.object({ status }).strict();
