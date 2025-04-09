import { prismaClient } from '../lib/prismaClient';

export async function getLike(articleId: number, userId: number) {
  return await prismaClient.like.findFirst({
    where: {
      articleId,
      userId,
    },
  });
}

export async function createLike(articleId: number, userId: number) {
  return await prismaClient.like.create({
    data: {
      articleId,
      userId,
    },
  });
}

export async function deleteLike(id: number) {
  return await prismaClient.like.delete({
    where: {
      id,
    },
  });
}
