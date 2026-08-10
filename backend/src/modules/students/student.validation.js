import { z } from "zod";

export const createStudentSchema = z.object({
  userId: z.string(),
  rollNumber: z.string(),
  batch: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

export const updateStudentSchema = z.object({
  rollNumber: z.string().optional(),
  batch: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});
