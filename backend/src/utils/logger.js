export function logRequest(req, res, next) {
  console.log(`${req.method} ${req.path}`)
  next()
}

export function logError(err, req, res, next) {
  console.error(err.stack)
  next(err)
}
