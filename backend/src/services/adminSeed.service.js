import User from "../modules/auth/auth.model.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

export async function seedInitialAdmin() {
  if (env.NODE_ENV !== "development") return;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) return;
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) return;
  const user = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
  console.log(`Admin user created: ${user.email}`);
}
