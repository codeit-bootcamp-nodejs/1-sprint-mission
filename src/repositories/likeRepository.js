import prisma from "../config/prisma.js";

async function findLikesByUser(userId) {
  return prisma.article.findMany({
    where: {
      likes: {
        some: {
          userId: userId,
        },
      },
    },
  });
}

async function findLike(userId, articleId) {
  return prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function saveLike(userId, articleId) {
  return prisma.like.create({
    data: {
      userId,
      articleId,
    },
  });
}

async function removeLike(likeId) {
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
