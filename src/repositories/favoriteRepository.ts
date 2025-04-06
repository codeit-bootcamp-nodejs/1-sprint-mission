import prisma from "../config/prisma";
import { Favorite, Product } from "@prisma/client";

async function findFavoritesByUser(userId: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      favorites: {
        some: {
          userId,
        },
      },
    },
  });
}

async function findFavorite(
  userId: string,
  productId: string
): Promise<Favorite | null> {
  return prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function saveFavorite(
  userId: string,
  productId: string
): Promise<Favorite> {
  return prisma.favorite.create({
    data: {
      userId,
      productId,
    },
  });
}

async function removeFavorite(favoriteId: string): Promise<Favorite> {
  return prisma.favorite.delete({
    where: {
      id: favoriteId,
    },
  });
}

export default {
  findFavoritesByUser,
  findFavorite,
  saveFavorite,
  removeFavorite,
};
