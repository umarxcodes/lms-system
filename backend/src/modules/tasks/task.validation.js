import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const status = z.enum(["todo", "in-progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  projectId: objectId,
  assignedTo: objectId.optional().nullable(),
  userId: objectId.optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().optional().nullable()
}).strict();

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().optional().nullable(),
  status: status.optional(),
  assignedTo: objectId.optional().nullable(),
  userId: objectId.optional().nullable(),
  projectId: objectId.optional()
}).strict();

export const updateTaskStatusSchema = z.object({ status }).strict();

export const assignTaskSchema = z.object({
  userId: objectId.optional(),
  assignedTo: objectId.optional(),
  studentId: objectId.optional()
}).refine(data => Boolean(data.userId || data.assignedTo || data.studentId), {
  message: "Student ID or User ID is required to assign task"
});

