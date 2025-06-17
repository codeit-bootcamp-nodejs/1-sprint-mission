
import { StructError } from "superstruct";
import BadRequestError from "../lib/error/BadReqestError";
import { RequestHandler, NextFunction, Request, Response } from "express";
import NotFoundError from "../lib/error/NotFoundError";
import ForbiddenError from "../lib/error/ForbiddenError";
import UnauthorizedError from "../lib/error/UnauthorizedError";

export const defaultNotFoundHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  res.status(404).send({ message: "해당 경로를 찾을 수 없습니다." });
};

export const globalErrorHandler = (
  err: Error & { code?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    console.warn("잘못된 요청 디테일:", err.message);
    res.status(400).send({ message: "잘못된 요청입니다." });
  } else if (err instanceof SyntaxError && err.message.includes("JSON")) {
    console.error("JSON 파싱 오류:", err.message);
    res.status(400).send({ message: "유효하지 않은 JSON입니다." });
  } else if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
  } else if (
    err instanceof UnauthorizedError ||
    err.name === "UnauthorizedError"
  ) {
    res.status(401).send({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).send({ message: err.message });
  } else {
    console.error("데이터 처리 오류:", err);
    res.status(500).send({ message: "서버에 문제가 발생하였습니다." });
  }
};
