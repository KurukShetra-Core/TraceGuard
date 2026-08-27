const errorHandler = (error, req, res, next) => {
  // We can replace/fallback to console.error
  const log = global.logger || console;

  log.error("================ ERROR ================");
  log.error({
    message: error?.message || "internal server error",
    stackTrace: error?.stack || "error stack !",
    // this will safely log the full error object
    err: error, 
    route: req.originalUrl,
    method: req.method,
    userId: req.body?.userId || req.params?.userId || null,
  });

  const errMessage = error?.error?.description || error.message || "internal server error";
  const status = typeof error.statusCode === "number" ? error.statusCode : 500;

  return res.status(status).json({
    success: false,
    message: error.message || errMessage || "Internal Server Error",
    errors: error.errors || [],
    data: error.data || null,
  });
};

module.exports = { errorHandler };
