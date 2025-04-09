import { prismaClient } from '../lib/prismaClient';

export async function getFavorite(productId: number, userId: number) {
  return await prismaClient.favorite.findFirst({
    where: {
      productId,
      userId,
    },
  });
}

export async function createFavorite(productId: number, userId: number) {
  return await prismaClient.favorite.create({
    data: {
      productId,
      userId,
    },
  });
}

export async function deleteFavorite(id: number) {
  return await prismaClient.favorite.delete({
    where: {
      id,
    },
  });
}
