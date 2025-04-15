import { User } from './models/User';
import { Express, Response as ExpessResponse } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

declare global {
  namespace NodeJS {
    interface ErrnoException extends Error {
      errno?: number;
      code?: string;
      path?: string;
      syscall?: string;
      status?: number; // SyntaxError에도 status가 있을 수 있음을 명시
    }
  }

  interface SyntaxError extends NodeJS.ErrnoException {
    columnNumber?: number;
    fileName?: string;
    lineNumber?: number;
  }
}