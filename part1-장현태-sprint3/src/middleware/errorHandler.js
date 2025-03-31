export function errorHandler(e, req, res, next) {
  console.log("Error occured");
  console.log(e);
  if (
    e.name === "StructError" ||
    (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") ||
    e instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).send({ message: e.message });
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2025"
  ) {
    res.status(404).send({ message: e.message });
  } else {
    res.status(500).send({ message: e.message });
  }
}

export function asyncHandler(fn) {
  return async function (req, res, next) {
    await fn(req, res).catch(next);
  };
}
