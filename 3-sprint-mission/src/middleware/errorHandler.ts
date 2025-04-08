import { Request, Response, NextFunction } from "express";
import { StatusError } from "../dto/index";

export function errorHandler(
  err: StatusError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("error:", err);

  const status = err.status || 500;
  const message = err.message || "서버 오류";

  res.status(status).json({ success: false, message });
}
