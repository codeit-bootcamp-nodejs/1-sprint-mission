import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";

import {
  CreateProductBodyStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct.js";
import { CreateCommentBodyStruct } from "../structs/commentsStruct.js";

export async function createProduct(req, res) {
  const { userId } = req.user;
  const { name, description, price, tags, images } = req.body;

  if (!userId) {
    const error = new Error("userId not found");
    error.code = 400;
    throw error;
  }

  const newProduct = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId },
  });

  res.status(201).json(newProduct);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  return res.send(product);
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(
    req.body,
    UpdateProductBodyStruct
  );

  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page = 1, pageSize = 10, orderBy, keyword } = req.query;

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const { userId } = req.user;

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  const comment = await prismaClient.comment.create({
    data: {
      productId,
      content,
      userId,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function postProductsLike(req, res) {
  const { userId } = req.user;
  const { productId } = req.params;
  const parseIntProductId = parseInt(productId, 10);

  if (!parseIntProductId) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  const product = await prismaClient.product.findUnique({
    where: { id: parseIntProductId },
    select: {
      likeCount: true,
    },
  });

  if (!product) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }

  try {
    await prismaClient.productLikes.create({
      data: { userId, productId: parseIntProductId },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw Object.assign(new Error("you have already liked"), { code: 400 });
    }
    throw error;
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id: parseIntProductId },
    data: {
      likeCount: { increment: 1 },
    },
    select: {
      id: true,
      name: true,
      likeCount: true,
    },
  });
  const isLiked = updatedProduct.likeCount > 0 ? true : false;
  return res.status(201).json({ updatedProduct, isLiked });
}

// 유저정보를 가져온다 -> 상품id가져오기 -> 좋아요 버튼 -> 증가 -> productlikes에 유저,상품정보 업데이트
// 상품좋아요를 누른 유저들중에 로그인한 유저가 있다면 에러

export async function deleteProductsLike(req, res) {
  const { userId } = req.user;
  const { productId } = req.params;

  const parseIntProductId = parseInt(productId, 10);

  if (!parseIntProductId) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }
  if (productLikes.likeCount === 0) {
    const error = new Error("no like");
    error.code = 400;
    throw error;
  }

  const userlike = await prismaClient.productLikes.deleteMany({
    where: { userId, productId: parseIntProductId },
  });

  const updatedProduct = await prismaClient.product.update({
    where: { id: parseIntProductId },
    data: {
      likeCount: { decrement: 1 },
    },
    select: {
      id: true,
      name: true,
      likeCount: true,
    },
  });
  const isLiked = updatedProduct.likeCount > 0 ? true : false;
  return res.status(200).json({ updatedProduct, isLiked });
}
