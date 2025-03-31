export function errorHandler(error, req, res, next) {
  console.log("Error occured");
  console.log(error.status);
  console.log(error.code);
  const status = error.status ?? error.code ?? 500;
  console.log(error);
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
