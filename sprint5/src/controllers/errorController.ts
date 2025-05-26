import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { isPrismaError, isSyntaxErrorWithBody } from '../lib/errors/errorGuards';

export const defaultNotFoundHandler: RequestHandler = (req, res, next) => {
  res.status(404).send({ message: 'Not found' });
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  if (isSyntaxErrorWithBody(err)) {
    res.status(400).send({ message: 'Invalid JSON' });
    return;
  }

  if (isPrismaError(err)) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
  return;
};
