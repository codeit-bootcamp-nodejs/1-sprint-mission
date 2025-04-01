import prisma from "../config/prisma.js";

async function getAll({ page, pageSize, orderBy, search, userId }) {
  const where = {
    author: { id: userId },
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

async function save(article) {
  console.log(article);
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

export default { getAll, save, getById, update, deleteById };
