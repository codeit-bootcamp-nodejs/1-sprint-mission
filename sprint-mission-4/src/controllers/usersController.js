import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { hashPassword, comparePassword } from '../lib/hash.js';

export const getMyInfo = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(user);
};

export const updateMyInfo = async (req, res) => {
  const { nickname, image } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: { nickname, image },
  });

  res.status(200).json({ message: '정보 수정 완료' });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  res.status(200).json({ message: '비밀번호 변경 완료' });
};

export const getMyProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(products);
};
