import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  members: z.array(z.string()).optional()
});
