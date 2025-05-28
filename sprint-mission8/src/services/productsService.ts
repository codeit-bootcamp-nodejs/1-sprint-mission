import { Server } from 'socket.io';
import * as notificationService from './notificationsService';
import { NotificationType } from '../types/notification';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as productsRepository from '../repositories/productsRepository';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';
import { prismaClient } from '../lib/prismaClient';

type CreateProductData = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'
>;
type UpdateProductData = Partial<CreateProductData> & { userId: number };

export async function createProduct(data: CreateProductData): Promise<Product> {
  const createdProduct = await productsRepository.createProduct(data);
  return {
    ...createdProduct,
    favoriteCount: 0,
    isFavorited: false,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await productsRepository.getProductWithFavorites(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return product;
}

export async function getProductList(
  params: PagePaginationParams,
  { userId }: { userId?: number } = {},
): Promise<PagePaginationResult<Product>> {
  const products = await productsRepository.getProductListWithFavorites(params, { userId });
  return products;
}

export async function updateProduct(
  id: number,
  data: UpdateProductData,
  io: Server,
): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);

  if (data.price !== undefined && data.price !== existingProduct.price) {
    const favorites = await prismaClient.favorite.findMany({
      where: { productId: id },
      select: { userId: true },
    });

    await Promise.all(
      favorites
        .filter((fav) => fav.userId !== data.userId) //본인은 알림에서 제외
        .map((fav) =>
          notificationService.createNotification(
            fav.userId,
            'PRICE_CHANGED',
            { productId: id, price: data.price! },
            io,
          ),
        ),
    );
  }

  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
