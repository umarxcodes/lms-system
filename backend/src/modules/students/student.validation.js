import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rollNumber: z.string().trim().min(1),
  batch: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
}).strict();

export const updateStudentSchema = z.object({
  rollNumber: z.string().optional(),
  batch: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
}).strict();
