import prisma from "../config/prisma";
import { CommentDTO, UpdateCommentDTO } from "../dto/CommentDTO";

const getById = async (id: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  return comment;
};

const update = async (id: number, data: UpdateCommentDTO) => {
  const comments = await prisma.comment.update({
    where: { id },
    data,

  });

  return comments;
};

const deleteById = async (id: number) => {
  const comment = await prisma.comment.delete({
    where: { id },
  });
  return comment;
};

const getProductId = async (
  productId: number,
  cursor: number,
  take: number,
  userId: number
) => {

  const lastId = cursor ? cursor : null;
  const comments = await prisma.comment.findMany({
    take: take,
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    where: { productId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return { comments };
};

const createProductComment = async (
  id: number,
  data: CommentDTO,
  userId: number
) => {
  const createdComment = await prisma.comment.create({
    data: {
      ...data,
      product: {
        connect: { id },
      },
      author: {
        connect: { id: userId },
      },
    },
  });
  return createdComment;
};

const getArticleId = async (
  articleId: number,
  cursor: number,
  take: number,
  userId: number
) => {
  const lastId = cursor ? cursor : null;
  const comments = await prisma.comment.findMany({
    take: take,
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    where: { articleId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return { comments };
};

const createArticleComment = async (
  id: number,
  data: CommentDTO,
  userId: number
) => {
  const createdComment = await prisma.comment.create({
    data: {
      ...data,
      article: {
        connect: { id },
      },
      author: {
        connect: { id: userId },
      },
    },
  });
  return createdComment;
};

export default {
  getById,
  update,
  deleteById,
  getProductId,
  createProductComment,
  getArticleId,
  createArticleComment,
};
