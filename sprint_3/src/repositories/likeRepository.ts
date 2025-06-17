
import { tuple } from "superstruct";
import prisma from "../config/prisma";

const getLikedProducts = async (userId: number) => {
  const likedProducts = await prisma.like.findMany({
    where: {
      authorId: userId,
      productId: { not: null },
    },
    include: {
      product: true,
    },
  });

  return likedProducts;
};

const likeProduct = async (userId: number, productId: number) => {

  const like = await prisma.like.create({
    data: {
      authorId: userId,
      productId: productId,
    },
  });

  const likeCount = await prisma.like.count({
    where: { productId: productId },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { likeCount: likeCount },
  });
};

const unLikeProduct = async (userId: number, productId: number) => {

  const unlike = await prisma.like.deleteMany({
    where: {
      authorId: userId,
      productId: productId,
    },
  });

  const likeCount = await prisma.like.count({
    where: { productId: productId },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { likeCount: likeCount },
  });
};

const likeProductStatus = async (userId: number, productId: number) => {

  const likeStatus = await prisma.like.findFirst({
    where: {
      authorId: userId,
      productId: productId,
    },
  });

  return likeStatus !== null;
};

const likePeople = async (productId: number) => {
  const likePeople = await prisma.like.findMany({
    where: { productId },
    select: { authorId: true },
  });

  return likePeople;
};


export default {
  getLikedProducts,
  likeProduct,
  likeProductStatus,
  unLikeProduct,
  likePeople

};
