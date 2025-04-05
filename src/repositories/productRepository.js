import prisma from "../config/prisma.js";

async function findAll({ offset, limit, order, search }) {
  let orderBy = { createdAt: "desc" };
  if (order === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  return await prisma.product.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });
}

async function getById(id) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      userId: product.userId,
    },
  });
}

async function update(id, data) {
  return await prisma.product.update({
    where: { id },
    data: data,
  });
}

async function remove(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

async function getByUserId(userId) {
  return prisma.product.findMany({
    where: {
      userId,
    },
  });
}

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
  findAll,
  getById,
  save,
  update,
  remove,
  getByUserId,
  findFavoritesByUser,
  findFavorite,
  saveFavorite,
  removeFavorite,
};
