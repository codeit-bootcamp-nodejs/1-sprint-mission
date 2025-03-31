import prisma from "../config/prisma.js";

async function getAllArticles({ offset, limit, orderBy, search }) {
  return await prisma.article.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
}

async function getById(id) {
  return await prisma.article.findUnique({
    where: { id },
  });
}

async function save(article) {
  return await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      userId: article.userId,
    },
  });
}

async function update(id, data) {
  return await prisma.article.update({
    where: { id },
    data: data,
  });
}

async function remove(id) {
  return await prisma.article.delete({
    where: { id },
  });
}

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
  getAllArticles,
  getById,
  save,
  update,
  remove,
  findLikesByUser,
  findLike,
  saveLike,
  removeLike,
};
