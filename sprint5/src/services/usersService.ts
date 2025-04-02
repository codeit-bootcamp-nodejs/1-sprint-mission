import { prisma } from '../lib/prismaClient';
import bcrypt from 'bcryptjs';
import { User, Product } from '@prisma/client';

type UpdateUserInput = {
  email?: string;
  nickname?: string;
  image?: string;
};

export const updateMyInfoService = async (userId: string, updateData: UpdateUserInput): Promise<Omit<User, 'password'>> => { 
  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
};

export const updateMyPasswordService = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};

export const getMyProductsService = async (userId:string): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });

  return products;
};
