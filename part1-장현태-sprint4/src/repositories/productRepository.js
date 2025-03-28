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

  return await prisma.product.findMany({
    skip: Number(offset),
    take: Number(limit),
    orderBy,
    omit: {
      updatedAt: true,
    },
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ],
    },
  });
}

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
}

async function save(userId, product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function update(id, data) {
  return await prisma.product.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function deleteById(id) {
  return await prisma.product.delete({
    where: {
      id: id,
    },
  });
}

async function getByUserId(userId) {
  return await prisma.product.findMany({
    where: {
      authorId: userId,
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
  update,
  save,
  deleteById,
  getByUserId,
  getAllLikedProduct,
};
