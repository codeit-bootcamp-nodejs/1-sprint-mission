import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { createFavorite, deleteFavorite, getFavorite } from '../repositories/favoriteRepository';
import { getById } from '../repositories/productRepository';
import { getByUserId } from '../repositories/userRepository';

export async function createFavoriteService(productId: number, userId: number) {
  const user = await getByUserId(userId);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const existingProduct = await getById(productId);

  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const existingFavorite = await getFavorite(productId, userId);

  if (existingFavorite) {
    throw new BadRequestError('Alreay Favorite');
  }

  await createFavorite(productId, userId);
}

export async function deleteFavoriteService(productId: number, userId: number) {
  const user = await getByUserId(userId);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const existingProduct = await getById(productId);
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const existingFavorite = await getFavorite(productId, userId);
  if (!existingFavorite) {
    throw new BadRequestError('Not favorited');
  }

  await deleteFavorite(existingFavorite.id);
}
