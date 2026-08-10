import { error } from "../utils/response.js";

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return error(res, "Access denied", 403);
    return next();
  };
}

export const authorize = requireRole;
