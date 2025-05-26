import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import { RequestHandler, ErrorRequestHandler } from 'express';

export const defaultNotFoundHandler: RequestHandler = (req, res, next) => {
  res.status(404).send({ message: 'Not found' });
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({ message: 'Invalid JSON' });
  }

  if (err.code) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
  }

  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    res.status(403).send({ message: err.message });
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
};
