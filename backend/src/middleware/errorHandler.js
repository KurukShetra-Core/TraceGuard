const errorHandler = (error, req, res, next) => {
  console.error("================ ERROR ================");
  console.error({
    message: error?.message || "internal server error",
    stackTrace: error?.stack || "error stack !",
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
