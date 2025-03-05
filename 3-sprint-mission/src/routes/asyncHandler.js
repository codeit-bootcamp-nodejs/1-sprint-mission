import { Prisma } from "@prisma/client";

export function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("Error occured");
      console.log(e.name);
      if (
        e.name === "StructError" ||
        (e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2022") ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}
