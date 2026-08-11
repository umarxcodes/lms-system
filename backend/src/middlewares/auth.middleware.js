import { verifyToken } from "../utils/jwt.js";
import { error } from "../utils/response.js";
import User from "../modules/auth/auth.model.js";

export async function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return error(res, "Authentication required", 401);

  const token = authorization.slice(7).trim();
  if (!token) return error(res, "Authentication required", 401);

  try {
    const payload = verifyToken(token);
    if (!payload.userId || !payload.role) return error(res, "Authentication required", 401);
    const user = await User.findById(payload.userId).select("role").lean();
    if (!user || user.role !== payload.role) return error(res, "Authentication required", 401);
    req.user = { userId: user._id.toString(), role: user.role };
    return next();
  } catch (err) {
    return error(res, "Authentication required", 401);
  }
}
