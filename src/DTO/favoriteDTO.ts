import { Favorite, Product } from '@prisma/client';
import { GetProductDTO } from './productDTO';

interface ProductFavorites extends Product {
  favorites: Favorite[];
}

export const favoriteProductDTO = (product: ProductFavorites, userId?: number): GetProductDTO => {
  const { favorites, ...rest } = product;

  return {
    ...rest,
    favoriteCount: favorites.length,
    isFavorited: userId ? favorites.some((favorite) => favorite.userId === userId) : undefined,
  };
};
