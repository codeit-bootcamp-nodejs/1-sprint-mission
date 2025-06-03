import prisma from "../config/prisma";
import { ProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import likeRepository from "./likeRepository";

const getAll = async (
  page: number,
  pageSize: number,
  orderBy: string,
  userId?: number,
  search?: string
) => {
  const where = {
    name: search ? { contains: search } : undefined,
  };

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const productsWithLike = await Promise.all(
    products.map(async (product) => {
      let isLiked = false;
      if (userId) {
        isLiked = await likeRepository.likeProductStatus(userId, product.id);
      }
      return {
        ...product,
        isLiked,
      };
    })
  );
  const totalCount = await prisma.product.count({ where });

  return { products: productsWithLike, totalCount };
};

const save = async (data: ProductDTO, authorId: number) => {
  const createdProduct = await prisma.product.create({
    data: {
      ...data,
      author: {
        connect: { id: authorId },
      },
    },
  });
  return createdProduct;
};

const getById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
};

const update = async (id: number, data: UpdateProductDTO) => {
  const updateProduct = await prisma.product.update({
    where: { id },
    data,
  });
  return updateProduct;
};

const deleteProduct = async (id: number) => {
  const product = await prisma.product.delete({
    where: { id },
  });
  return product;
};

export default { save, getById, update, deleteProduct, getAll };
