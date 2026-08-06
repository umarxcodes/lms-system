import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
};

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("User already exists with this email");
    error.status = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return { user, token };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};
