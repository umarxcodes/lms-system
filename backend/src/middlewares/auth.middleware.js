import { verifyToken } from "../utils/jwt.js"

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" })
  }
  const token = authHeader.split(" ")[1]
  try {
    req.user = verifyToken(token)
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}
