import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { ErrorRequestHandler, RequestHandler } from 'express';

// 2. Express JSON 에러를 위한 인터페이스 정의
interface SyntaxErrorWithStatus extends SyntaxError {
  status?: number;
  body?: any;
}

export const defaultNotFoundHandler: RequestHandler = (req, res, next): void => {
  res.status(404).send({ message: 'Not found' });
  return;
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  /** From express.json middleware */
  if (
    err instanceof SyntaxError &&
    (err as SyntaxErrorWithStatus).status === 400 &&
    'body' in err // SyntaxErrorWithStatus 인터페이스를 만들어 Express에서 발생하는 JSON 파싱 에러의 확장된 형태를 정의했습니다.
  ) {
    res.status(400).send({ message: 'Invalid JSON' });
    return;
  }

  /** Prisma error codes */
  if (err.code) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
    return;
  }

  /** Application errors */
  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).send({ message: err.message });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).send({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
  return;
};
