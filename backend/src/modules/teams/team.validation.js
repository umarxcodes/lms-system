import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createTeamSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  members: z.array(objectId).optional()
}).strict();

export const updateTeamSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().optional()
}).strict();

export const memberSchema = z.object({ memberId: objectId }).strict();
