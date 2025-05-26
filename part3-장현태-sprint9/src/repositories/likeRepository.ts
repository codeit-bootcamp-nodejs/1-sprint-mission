import prisma from "../config/prisma";

async function saveProductLike(userId: number, productId: string) {
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

async function saveArticleLike(userId: number, articleId: string) {
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

async function deleteArticleLike(userId: number, articleId: string) {
  return await prisma.like.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
}
async function deleteProductLike(userId: number, productId: string) {
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
