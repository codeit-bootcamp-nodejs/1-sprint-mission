import prisma from "../config/prisma.js";

async function findFavoritesByUser(userId) {
  return prisma.product.findMany({
    where: {
      favorites: {
        some: {
          userId: userId,
        },
      },
    },
  });
}

async function findFavorite(userId, productId) {
  return prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function saveFavorite(userId, productId) {
  return prisma.favorite.create({
    data: {
      userId,
      productId,
    },
  });
}

async function removeFavorite(favoriteId) {
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
