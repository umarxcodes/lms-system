import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  teamId: z.string(),
  deadline: z.string().datetime().optional()
});
