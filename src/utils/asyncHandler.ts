import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

const asyncHandler = (handler: AsyncHandler) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await handler(req, res);
    } catch (e: any) {
      if (e.name === "StructError") {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          res.status(400).send({ message: e.message });
        } else if (e.code === "P2025") {
          res.status(404).send({ message: e.message });
        } else {
          res.status(500).send({ message: e.message });
        }
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
};

export default asyncHandler;
