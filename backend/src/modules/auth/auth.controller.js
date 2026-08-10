import { login, getMe } from "./auth.service.js";
import { validateLogin } from "./auth.validation.js";
import { error, success } from "../../utils/response.js";

export const loginController = async (req, res, next) => {
  const validation = validateLogin(req.body);
  if (!validation.success) return error(res, validation.message, 400);

  try {
    const result = await login(validation.data);
    if (!result) return error(res, "Invalid email or password", 401);
    return success(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const user = await getMe(req.user.userId);
    if (!user) return error(res, "Authentication required", 401);
    return success(res, user, "Authenticated user retrieved");
  } catch (error) {
    next(error);
  }
};
