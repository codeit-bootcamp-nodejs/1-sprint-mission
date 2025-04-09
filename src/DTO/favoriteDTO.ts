import { Favorite, Product } from '@prisma/client';
import { ProductFavoriteDTO } from './productDTO';

interface ProductFavorites extends Product {
  favorites: Favorite[];
}

export const favoriteProductDTO = (
  product: ProductFavorites,
  userId?: number,
): ProductFavoriteDTO => {
  const { favorites, ...rest } = product;

  return {
    ...rest,
    favoriteCount: favorites.length,
    isFavorited: userId ? favorites.some((favorite) => favorite.userId === userId) : undefined,
  };
};
