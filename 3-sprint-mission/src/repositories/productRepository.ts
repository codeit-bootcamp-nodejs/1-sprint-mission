import { prismaClient } from "../lib/prismaClient";
import { Product } from "../dto/index";

async function save(userId: number, product: Product) {
  return await prismaClient.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      user: {
        connect: { id: userId },
      },
    },
  });
}

async function getById(id: number) {
  console.log("getbyId호출됨");
  return await prismaClient.product.findUnique({
    where: {
      id: id,
    },
  });
}

async function getUserId(userId: number) {
  return await prismaClient.product.findMany({
    where: {
      id: userId,
    },
  });
}

async function update(id: number, data: Product) {
  return await prismaClient.product.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function remove(id: number) {
  return await prismaClient.product.delete({
    where: {
      id: id,
    },
  });
}

async function getProductList(
  page: number,
  pageSize: number,
  orderBy: "recent" | "oldset",
  keyword: string
) {
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;

  try {
    const totalCount = await prismaClient.product.count({ where });
    const products = await prismaClient.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
      where,
    });

    return { list: products, totalCount };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

async function addLike(userId: number, productId: number) {
  return await prismaClient.productLikes.create({
    data: {
      userId,
      productId,
    },
  });
}

async function deleteLike(userId: number, productId: number) {
  return await prismaClient.productLikes.deleteMany({
    where: {
      userId,
      productId,
    },
  });
}

async function userLikeProducts(userId: number) {
  return await prismaClient.product.findMany({
    where: { ProductLikes: { some: { userId } } },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });
}

export default {
  save,
  remove,
  update,
  getById,
  getProductList,
  addLike,
  deleteLike,
  getUserId,
  userLikeProducts,
};
