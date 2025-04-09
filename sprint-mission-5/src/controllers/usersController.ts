import { Request, Response } from 'express';
import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id);
  }

  const { password: _, ...userWithoutPassword } = user;
  res.send(userWithoutPassword);
  return;
}

export async function updateMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, UpdateMeBodyStruct);

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data,
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  res.status(200).send(userWithoutPassword);
  return;
}

export async function updateMyPassword(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new NotFoundError('user', req.user.id);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prismaClient.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.status(200).send();
  return;
}

export async function getMyProductList(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await prismaClient.product.count({
    where: {
      ...where,
      userId: req.user.id,
    },
  });

  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      userId: req.user.id,
    },
    include: {
      favorites: true,
    },
  });

  const productsWithFavorites = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: product.favorites.some((favorite) => favorite.userId === req.user?.id),
  }));

  res.send({
    list: productsWithFavorites,
    totalCount,
  });
  return;
}

export async function getMyFavoriteList(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const totalCount = await prismaClient.product.count({
    where: {
      ...where,
      favorites: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });

  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: {
      ...where,
      favorites: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      favorites: true,
    },
  });

  const productsWithFavorites = products.map((product) => ({
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: true,
  }));

  res.send({
    list: productsWithFavorites,
    totalCount,
  });
  return;
}
