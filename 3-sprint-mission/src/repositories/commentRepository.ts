import { prismaClient } from "../lib/prismaClient";

async function getCommentById(id: number) {
  return await prismaClient.comment.findUnique({ where: { id } });
}

async function updateComment(id: number, content: string) {
  return await prismaClient.comment.update({
    where: { id },
    data: { content },
  });
}

async function deleteComment(id: number) {
  return await prismaClient.comment.delete({ where: { id } });
}

export async function createComment(
  productId: number,
  content: string,
  userId: number
) {
  return prismaClient.comment.create({
    data: { productId, content, userId },
  });
}

async function getComments(productId: number) {
  return prismaClient.comment.findMany({
    where: {
      productId,
    },
  });
}

export default {
  getCommentById,
  updateComment,
  deleteComment,
  createComment,
  getComments,
};
