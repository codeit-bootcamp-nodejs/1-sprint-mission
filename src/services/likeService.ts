import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { getById } from '../repositories/articlesRepository';
import { createLike, deleteLike, getLike } from '../repositories/likeRepository';
import { getByUserId } from '../repositories/userRepository';

export async function createLikeService(articleId: number, userId: number) {
  const user = await getByUserId(userId);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const existingArticle = await getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await getLike(articleId, userId);
  if (existingLike) {
    throw new BadRequestError('Already liked');
  }

  await createLike(articleId, userId);
}

export async function deleteLikeService(articleId: number, userId: number) {
  const user = await getByUserId(userId);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const existingArticle = await getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await getLike(articleId, userId);
  if (!existingLike) {
    throw new BadRequestError('Not liked');
  }

  await deleteLike(existingLike.id);
}
