import prisma from "../config/prisma.js";

async function getById(id) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  return comment;
}

async function update(id, comment) {
  const comments = await prisma.comment.update({
    where: { id },
    data: {
      title: comment.title,
      content: comment.content,
    },
  });

  return comments;
}

async function deleteById(id) {
  const comment = await prisma.comment.delete({
    where: { id },
  });
  return comment;
}

async function getProductId(productId, cursor, take, userId) {
  const lastId = cursor ? cursor : null;
  const comments = await prisma.comment.findMany({
    take: parseInt(take),
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    where: { productId, AND: { author: { id: userId } } },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return { comments };
}

async function createProductComment(id, comment, userId) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      product: {
        connect: { id },
      },
      author: {
        connect: { id: userId },
      },
    },
  });
  return createdComment;
}

async function getArticleId(articleId, cursor, take, userId) {
  const lastId = cursor ? cursor : null;
  const comments = await prisma.comment.findMany({
    take: parseInt(take),
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    where: { articleId, AND: { author: { id: userId } } },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return { comments };
}

async function createArticleComment(id, comment, userId) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      article: {
        connect: { id },
      },
      author: {
        connect: { id: userId },
      },
    },
  });
  return createdComment;
}

export default {
  getById,
  update,
  deleteById,
  getProductId,
  createProductComment,
  getArticleId,
  createArticleComment,
};
