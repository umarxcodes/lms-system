import User from "./auth.model.js";
import { signToken } from "../../utils/jwt.js";

export function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.student ? { studentId: user.student.toString() } : {}),
    profileImage: user.profileImage?.url ? { url: user.profileImage.url } : null
  };
}

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) return null;

  const safeUser = toSafeUser(user);
  return { user: safeUser, token: signToken({ userId: safeUser.id, role: safeUser.role }) };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  return user ? toSafeUser(user) : null;
};
