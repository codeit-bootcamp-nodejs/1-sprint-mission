import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

export interface TokenPayload {
  id: number;
}

export function generateTokens(userId: number): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
  if (typeof decoded !== 'object' || typeof decoded.id !== 'number') {
    throw new Error('Invalid token');
  }
  return { id: decoded.id };
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
  if (typeof decoded !== 'object' || typeof decoded.id !== 'number') {
    throw new Error('Invalid token');
  }
  return { id: decoded.id };
}
