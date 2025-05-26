import { RequestHandler } from 'express';

export function withAsync(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise
      .resolve(fn(req, res, next))
      .catch(next);
  };
}
