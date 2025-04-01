function throwUnauthorizedError() {
  const error = new Error("Unauthorized");
  error.code = 401;
  throw error;
}

export default throwUnauthorizedError;
