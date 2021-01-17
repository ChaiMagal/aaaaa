const notFound = (req, res, next) => {
  const error = new Error(`not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    //the stack trace message is showing only in development mode. in production mode the messag will not show
  })
  return
}

export { notFound, errorHandler }
