import bcrypt from "bcrypt";

export async function hashPassword(plain) {
  return await bcrypt.hash(plain, 10);
}

export async function comparePassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}
