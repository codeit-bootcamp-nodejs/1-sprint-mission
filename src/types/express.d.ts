import { User } from "@prisma/client";
import { Request } from "express";

export interface CustomRequest extends Request {
  user: {
    userId: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        userId: string;
      };
      auth: {
        userId: string;
      };
    }
  }
}

export {};
