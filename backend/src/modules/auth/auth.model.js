import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../../utils/password.js";

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  STUDENT: "STUDENT"
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(ROLES), required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
}, { timestamps: true });

userSchema.pre("save", async function hashNewPassword() {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
