import prisma from "../config/prisma.js";

export const getLikedProducts = async (userId) => {
  return await prisma.like.findMany({
    where: {
      authorId: userId,
      productId: { not: null },
    },
    include: {
      product: true,
    },
  });
};

export const getLikedArticles = async (userId) => {
  return await prisma.like.findMany({
    where: {
      authorId: userId,
      articleId: { not: null },
    },
    include: {
      article: true,
    },
  });
};

export const getProductLikeStatus = async (userId, productId) => {
  const like = await prisma.like.findFirst({
    where: {
      authorId: userId,
      productId: productId,
    },
  });

  return like !== null;
};

export const getArticleLikeStatus = async (userId, articleId) => {
  const like = await prisma.like.findFirst({
    where: {
      authorId: userId,
      articleId: articleId,
    },
  });

  return like !== null;
};

export const deleteLikeProduct = async (userId, productId) => {
  await prisma.like.deleteMany({
    where: {
      authorId: userId,
      productId: productId,
    },
  });
};

export const createLikeProduct = async (userId, productId) => {
  await prisma.like.create({
    data: {
      authorId: userId,
      productId: productId,
    },
  });
};

export const deleteLikeArticle = async (userId, articleId) => {
  await prisma.like.deleteMany({
    where: {
      authorId: userId,
      articleId: articleId,
    },
  });
};

export const createLikeArticle = async (userId, articleId) => {
  await prisma.like.create({
    data: {
      authorId: userId,
      articleId: articleId,
    },
  });
};
