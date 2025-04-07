import prisma from "../config/prisma";
import { Article, Like, Prisma } from "@prisma/client";

export interface GetAllArticlesParams {
  offset: number;
  limit: number;
  orderBy: { createdAt: "asc" | "desc" };
  search: string;
}

async function getAllArticles({
  offset,
  limit,
  orderBy = { createdAt: "desc" },
  search,
}: GetAllArticlesParams): Promise<Partial<Article>[]> {
  return prisma.article.findMany({
    skip: offset,
    take: limit,
    orderBy,
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
}

async function getById(id: string): Promise<Article | null> {
  return prisma.article.findUnique({
    where: { id },
  });
}

async function save(article: {
  title: string,
  content: string,
  userId: string,
}): Promise<Article> {
  return prisma.article.create({
    data: article,
  });
}

async function update(id: string, data: Partial<Article>): Promise<Article> {
  return prisma.article.update({
    where: { id },
    data,
  });
}

async function remove(id: string): Promise<Article> {
  return prisma.article.delete({
    where: { id },
  });
}

async function findLikesByUser(userId: string): Promise<Article[]> {
  return prisma.article.findMany({
    where: {
      likes: {
        some: {
          userId,
        },
      },
    },
  });
}

async function findLike(
  userId: string,
  articleId: string
): Promise<Like | null> {
  return prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function saveLike(userId: string, articleId: string): Promise<Like> {
  return prisma.like.create({
    data: {
      userId,
      articleId,
    },
  });
}

async function removeLike(likeId: string): Promise<Like> {
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
