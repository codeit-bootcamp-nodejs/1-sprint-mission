import prisma from "../config/prisma";
import { Like, Article } from "@prisma/client";

async function findLikesByUser(userId: string): Promise<Article[]> {
  return prisma.article.findMany({
    where: {
      likes: {
        some: {
          userId,
        },
      },
    },
  });
}

async function findLike(
  userId: string,
  articleId: string
): Promise<Like | null> {
  return prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function saveLike(userId: string, articleId: string): Promise<Like> {
  return prisma.like.create({
    data: {
      userId,
      articleId,
    },
  });
}

async function removeLike(likeId: string): Promise<Like> {
  return prisma.like.delete({
    where: {
      id: likeId,
    },
  });
}

export default {
  findLikesByUser,
  findLike,
  saveLike,
  removeLike,
};
