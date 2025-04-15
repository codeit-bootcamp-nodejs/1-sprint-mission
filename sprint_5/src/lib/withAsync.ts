import { Request, Response, NextFunction, RequestHandler } from 'express';

export function withAsync(fn: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
