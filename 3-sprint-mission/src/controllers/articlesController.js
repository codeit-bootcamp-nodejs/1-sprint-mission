import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
} from "../structs/articlesStructs.js";
import { CreateCommentBodyStruct } from "../structs/commentsStruct.js";

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);

  data.userId = req.user.userId;

  const article = await prismaClient.article.create({ data });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  return res.send(article);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await prismaClient.article.update({ where: { id }, data });
  if (!article) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  return res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw error;
  }

  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const { userId } = req.user;

  const existingArticle = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function postArticlesLike(req, res) {
  const { userId } = req.user;
  const { articleId } = req.params;
  const parseIntArticleId = parseInt(articleId, 10);

  if (!parseIntArticleId) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  const article = await prismaClient.article.findUnique({
    where: { id: parseIntArticleId },
    select: {
      likeCount: true,
    },
  });

  if (!article) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  try {
    await prismaClient.articleLikes.create({
      data: { userId, articleId: parseIntArticleId },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw Object.assign(new Error("you have already liked"), { code: 400 });
    }
    throw error;
  }

  const updatedArticle = await prismaClient.article.update({
    where: { id: parseIntArticleId },
    data: {
      likeCount: { increment: 1 },
    },
    select: {
      id: true,
      title: true,
      likeCount: true,
    },
  });
  const isLiked = updatedArticle.likeCount > 0 ? true : false;
  return res.status(201).json({ updatedArticle, isLiked });
}

export async function deleteArticlesLike(req, res) {
  const { userId } = req.user;
  const { articleId } = req.params;

  const parseIntArticleId = parseInt(articleId, 10);

  if (!parseIntArticleId) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }

  const article = await prismaClient.article.findUnique({
    where: { id: parseIntArticleId },
    select: {
      likeCount: true,
    },
  });

  if (!article) {
    const error = new Error("article not found");
    error.code = 404;
    throw error;
  }
  if (article.likeCount === 0) {
    const error = new Error("no likes");
    error.code = 400;
    throw error;
  }

  const userLike = await prismaClient.articleLikes.deleteMany({
    where: { userId, articleId: parseIntArticleId },
  });

  if (userLike.length === 0) {
    const error = new Error("you haven't like");
    error.code = 400;
    throw error;
  }

  const updatedArticle = await prismaClient.article.update({
    where: { id: parseIntArticleId },
    data: {
      likeCount: { decrement: 1 },
    },
    select: {
      id: true,
      title: true,
      likeCount: true,
    },
  });
  const isLiked = updatedArticle.likeCount > 0 ? true : false;
  return res.status(200).json({ updatedArticle, isLiked });
}
