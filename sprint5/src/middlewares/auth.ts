import { RequestHandler } from 'express';
import { prisma } from '../lib/prismaClient';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: '토큰이 없습니다.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string') {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as JwtPayload).id },
    });
    if (!user) {
      res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    return;
  }
};
