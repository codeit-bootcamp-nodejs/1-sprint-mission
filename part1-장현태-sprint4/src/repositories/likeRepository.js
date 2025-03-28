import prisma from "../config/prisma.js";

async function saveProductLike(userId, productId) {
  return await prisma.like.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
  });
}

async function saveArticleLike(userId, articleId) {
  return await prisma.like.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      article: {
        connect: {
          id: articleId,
        },
      },
    },
  });
}

async function deleteArticleLike(userId, articleId) {
  return await prisma.like.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
}
async function deleteProductLike(userId, productId) {
  return await prisma.like.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });
}

export default {
  saveArticleLike,
  saveProductLike,
  deleteArticleLike,
  deleteProductLike,
};
