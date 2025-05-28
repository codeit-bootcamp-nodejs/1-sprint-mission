import { get } from "http";
import prisma from "../config/prisma";
import { Article } from "@prisma/client";

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

async function getById(id: string) {
  return await prisma.article.findUnique({
    where: {
      id: id,
    },
  });
}

async function getArticleAuthorIdByArticleId(id: string) {
  const article = await prisma.article.findUnique({
    where: {
      id: id,
    },
    select: {
      authorId: true,
    },
  });
  return article!.authorId;
}

async function save(
  userId: number,
  article: {
    title: string;
    content: string;
  }
) {
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

async function update(
  id: string,
  article: {
    title: string;
    content: string;
  }
) {
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

async function deleteById(id: string) {
  return await prisma.article.delete({
    where: {
      id: id,
    },
  });
}

async function getAllLikedProduct(userId: number) {
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
  getArticleAuthorIdByArticleId,
  save,
  update,
  deleteById,
  getAllLikedProduct,
};