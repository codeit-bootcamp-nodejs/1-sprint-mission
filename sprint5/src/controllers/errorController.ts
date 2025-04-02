import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { Request, Response, NextFunction } from 'express';
import {
  isPrismaError,
  isSyntaxErrorWithBody,
} from '../lib/errors/errorGuards';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (isSyntaxErrorWithBody(err)) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  /** Prisma error codes */
if (isPrismaError(err)) {
  console.error(err);
  return res.status(500).send({ message: 'Failed to process data' });
}

  /** Application error */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
