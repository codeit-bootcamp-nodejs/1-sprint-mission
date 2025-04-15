import { prismaClient } from "../lib/prismaClient";
import { CreateComment, CreateArticle, UpdateArticle } from "../dto/index";

async function save(data: CreateArticle) {
  return await prismaClient.article.create({
    data,
  });
}

async function getArticleById(id: number) {
  return await prismaClient.article.findUnique({
    where: { id },
  });
}

async function update(id: number, data: UpdateArticle) {
  return await prismaClient.article.update({
    where: { id },
    data,
  });
}

async function remove(id: number) {
  return await prismaClient.article.delete({
    where: { id },
  });
}

async function getArticleList(
  where: Record<string, unknown>,
  skip: number,
  take: number,
  orderBy: Record<string, "asc" | "desc">
): Promise<{ list: CreateArticle[]; totalCount: number }> {
  const totalCount = await prismaClient.article.count({
    where,
  });
  const articles = await prismaClient.article.findMany({
    where,
    skip,
    take,
    orderBy,
  });
  return { list: articles, totalCount };
}

async function createComment(data: CreateComment) {
  return await prismaClient.comment.create({
    data,
  });
}

async function getCommentList(
  articleId: number,
  page: number,
  pageSize: number
) {
  const comments = await prismaClient.comment.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  return { list: comments };
}

async function addLike(userId: number, articleId: number) {
  return await prismaClient.articleLikes.create({
    data: { userId, articleId },
  });
}

async function removeLike(userId: number, articleId: number) {
  return await prismaClient.articleLikes.deleteMany({
    where: { userId, articleId },
  });
}

async function getArticleLikeCount(id: number) {
  return await prismaClient.article.findUnique({
    where: { id },
  });
}

export default {
  removeLike,
  getArticleLikeCount,
  addLike,
  getCommentList,
  createComment,
  getArticleList,
  remove,
  update,
  getArticleById,
  save,
};
