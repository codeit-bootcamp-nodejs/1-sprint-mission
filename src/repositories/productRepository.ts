import prisma from "../config/prisma";
import { Product, Favorite, Prisma } from "@prisma/client";

export interface FindAllParams {
  offset: number;
  limit: number;
  order: string;
  search: string;
}

async function findAll({
  offset,
  limit,
  order,
  search,
}: FindAllParams): Promise<Partial<Product>[]> {
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: order === "oldest" ? "asc" : "desc",
  };

  return prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy,
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });
}

async function getById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  });
}

async function save(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  return prisma.product.create({
    data: product,
  });
}

async function update(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data,
  });
}

async function remove(id: string): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  });
}

async function getByUserId(userId: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: { userId },
  });
}

async function findFavoritesByUser(userId: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      favorites: {
        some: { userId },
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
      userId_productId: { userId, productId },
    },
  });
}

async function saveFavorite(
  userId: string,
  productId: string
): Promise<Favorite> {
  return prisma.favorite.create({
    data: { userId, productId },
  });
}

async function removeFavorite(favoriteId: string): Promise<Favorite> {
  return prisma.favorite.delete({
    where: { id: favoriteId },
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
