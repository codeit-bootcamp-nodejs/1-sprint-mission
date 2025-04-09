import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import { User } from '@prisma/client';
import { RequestHandler } from 'express-serve-static-core';

interface AuthenticatedRequest extends Request {
  user?: User | null;
}

interface AuthenticateOptions {
  optional?: boolean;
}

const authenticate = (options: AuthenticateOptions = { optional: false }): RequestHandler => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      if (options.optional) return next();
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const { id: userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      req.user = user;
    } catch {
      if (options.optional) return next();
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    return next();
  };
};

export default authenticate;
