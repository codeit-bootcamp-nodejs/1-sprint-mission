import { Prisma, Product } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { GetProductListDTO } from '../DTO/commonDTO';

export async function createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
  return await prismaClient.product.create({
    data,
  });
}

type ProductWithFavorite = Prisma.ProductGetPayload<{
  include: { favorites: true };
}>;
export async function getById(id: number): Promise<ProductWithFavorite | null> {
  return await prismaClient.product.findUnique({
    where: { id },
    include: {
      favorites: true,
    },
  });
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
  return await prismaClient.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number): Promise<Product> {
  return await prismaClient.product.delete({
    where: { id },
  });
}

export const getProduct = ({ page, pageSize, orderBy, where }: GetProductListDTO) => {
  return prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: { favorites: true },
  });
};
