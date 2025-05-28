import { Prisma, User } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { ParamsDTO } from '../DTO/commonDTO';

export async function getByUserId(id: number): Promise<User | null> {
  return await prismaClient.user.findUnique({
    where: { id },
  });
}

export async function updateMe(id: number, data: Prisma.UserUpdateInput): Promise<User> {
  return await prismaClient.user.update({
    where: { id },
    data,
  });
}

export async function getMyProductList(
  userId: number,
  page: number,
  pageSize: number,
  orderBy: 'recent' | 'oldest',
  where: Prisma.ProductWhereInput,
) {
  return await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      userId,
    },
    include: {
      favorites: true,
    },
  });
}

export async function getFavoriteProduct(userId: number, params: ParamsDTO) {
  const { page, pageSize, orderBy, keyword } = params;

  const where: Prisma.ProductWhereInput = {
    ...(keyword && {
      OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
    }),
    favorites: {
      some: { userId },
    },
  };

  return await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
    include: {
      favorites: true,
    },
  });
}

export async function getMyNotificationList(
  userId: number,
  page: number,
  pageSize: number,
  orderBy: 'recent' | 'oldest',
) {
  return await prismaClient.notification.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      userId,
    },
  });
}
