import prisma from "../config/prisma.js";
import NotFoundError from "../lib/error/NotFoundError.js";

async function getAll({ page, pageSize, orderBy, search }) {
  const where = {
    AND: [
      { title: search ? { contains: search } : undefined },
      {
        content: search ? { contains: search } : undefined,
      },
    ],
  };

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalCount = await prisma.article.count({ where });

  return { articles, totalCount };
}

async function getUserAll({ page, pageSize, orderBy, userId }) {
  const where = {
    author: { id: userId },
  };

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalCount = await prisma.article.count({ where });

  return { articles, totalCount };
}

async function save(article) {
  const createdArticle = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      author: {
        connect: {
          id: article.authorId,
        },
      },
    },
  });

  return createdArticle;
}

async function getById(id) {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(id);
  }
  return article;
}

async function update(id, article) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      title: article.title,
      content: article.content,
    },
  });

  if (!updatedArticle) {
    throw new NotFoundError(id);
  }
  return updatedArticle;
}

async function deleteById(id) {
  const article = await prisma.article.delete({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(id);
  }

  return article;
}

export default { getAll, getUserAll, save, getById, update, deleteById };
