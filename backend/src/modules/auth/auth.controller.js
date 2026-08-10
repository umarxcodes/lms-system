import { register, login, getMe } from "./auth.service.js";

export const registerController = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
