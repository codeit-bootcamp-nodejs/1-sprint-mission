import prisma from "../config/prisma";

async function getAll(query: {
  offset: string;
  limit: string;
  order: string;
  search: string;
}) {
  const { offset = 0, limit = 10, order = "newest", search = "" } = query;

  let orderBy: {
    createdAt: "asc" | "desc";
  } = { createdAt: "asc" };
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

async function getById(id: string) {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
}

async function save(
  userId: string,
  product: {
    name: string;
    description: string;
    price: number;
    tags: string[];
  }
) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      author: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
}

async function update(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
  }
) {
  return await prisma.product.update({
    where: {
      id: id,
    },
    data: data,
    include: {
      like: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
}

async function deleteById(id: string) {
  return await prisma.product.delete({
    where: {
      id: id,
    },
  });
}

async function getByUserId(userId: string) {
  return await prisma.product.findMany({
    where: {
      authorId: Number(userId),
    },
  });
}

async function getAllLikedProduct(userId: string) {
  return await prisma.product.findMany({
    where: {
      like: {
        some: {
          userId: Number(userId),
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
