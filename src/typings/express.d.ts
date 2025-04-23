import Express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
      auth?: { userId: number };
    }
    interface Request {
      user?: User;
    }
  }
}
