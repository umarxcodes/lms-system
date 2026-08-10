export default function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500 ? "Internal server error" : err.message;
  res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}) });
}
