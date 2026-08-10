import User, { ROLES } from "../modules/auth/auth.model.js";
import { env } from "../config/env.js";

export async function seedInitialAdmin() {
  if (env.NODE_ENV !== "development") return;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) return;
  const existing = await User.findOne({ role: ROLES.ADMIN });
  if (existing) return;
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: ROLES.ADMIN });
  console.log("Initial Admin user created");
}
