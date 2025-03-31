import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/hash.js';
import { generateToken } from '../lib/jwt.js';
import { withAsync } from '../lib/withAsync.js';

const prisma = new PrismaClient();

export const signup = withAsync(async (req, res) => {
  const { email, nickname, password } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: '이미 가입된 이메일입니다.' });

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, nickname, password: hashed },
  });

  res.status(201).json({ message: '회원가입 성공', userId: user.id });
});

export const login = withAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

  const token = generateToken(user);

  res.status(200).json({ message: '로그인 성공', token });
});
