import { RequestHandler } from 'express';
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const createArticle: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, CreateArticleBodyStruct);

  const article = await prismaClient.article.create({
    data: {
      ...data,
      userId: req.user.id,
    },
  });

  res.status(201).send(article);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });

  if (!article) {
    throw new NotFoundError('article', id);
  }

  const articleWithLikes = {
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: req.user ? article.likes.some((like) => like.userId === req.user?.id) : false, // 수정된 부분
  };

  res.send(articleWithLikes);
};

export const updateArticle: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  const updatedArticle = await prismaClient.article.update({ where: { id }, data });
  res.send(updatedArticle);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  await prismaClient.article.delete({ where: { id } });
  res.status(204).send();
};

export const getArticleList: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: {
      likes: true,
    },
  });

  const articlesWithLikes = articles.map((article) => ({
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: req.user ? article.likes.some((like) => like.userId === req.user?.id) : false,
  }));

  res.send({
    list: articlesWithLikes,
    totalCount,
  });
};

export const createComment: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const createdComment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId: req.user.id,
    },
  });

  res.status(201).send(createdComment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
};

export const createLike: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (existingLike) {
    throw new BadRequestError('Already liked');
  }

  await prismaClient.like.create({ data: { articleId, userId: req.user.id } });
  res.status(201).send();
};

export const deleteLike: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (!existingLike) {
    throw new BadRequestError('Not liked');
  }

  await prismaClient.like.delete({ where: { id: existingLike.id } });
  res.status(204).send();
};
