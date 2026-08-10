import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ error: "Email is required" }).trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required")
}).strict();

export function validateLogin(input) {
  const result = loginSchema.safeParse(input);
  if (!result.success) return { success: false, message: result.error.issues[0].message };
  return { success: true, data: result.data };
}
