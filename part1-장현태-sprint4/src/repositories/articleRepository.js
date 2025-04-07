import prisma from "../config/prisma.js";

async function getAll(query) {
  const { offset = 0, limit = 10, order = "newest", search = "" } = query;

  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;
    case "newest":
      orderBy = {
        createdAt: "desc",
      };
      break;
  }

  return await prisma.article.findMany({
    skip: Number(offset),
    take: Number(limit),
    orderBy,
    omit: {
      updatedAt: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
    },
  });
}

async function getById(id) {
  return await prisma.article.findUnique({
    where: {
      id: id,
    },
  });
}

async function save(userId, article) {
  return await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function update(id, article) {
  return await prisma.article.update({
    where: {
      id: id,
    },
    data: {
      title: article.title,
      content: article.content,
    },
  });
}

async function deleteById(id) {
  return await prisma.article.delete({
    where: {
      id: id,
    },
  });
}

async function getAllLikedProduct(userId) {
  return await prisma.product.findMany({
    where: {
      like: {
        some: {
          userId: userId,
        },
      },
    },
  });
}

export default {
  getAll,
  getById,
  save,
  update,
  deleteById,
  getAllLikedProduct,
};
