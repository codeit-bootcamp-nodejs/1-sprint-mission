import { create } from 'superstruct';
import {
  CreateArticleBodyStruct,
  GetArticleListParamsStruct,
  UpdateArticleBodyStruct,
} from '../structs/articlesStructs';
import { Request, Response } from 'express';
import {
  createArticleService,
  createCommentService,
  deleteArticleServiec,
  getArticleCommentService,
  getArticleDetailService,
  getArticleListService,
  updateArticleService,
} from '../services/articlesService';
import { IdParamsStruct } from '../structs/commonStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { getById } from '../repositories/articlesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { createLikeService, deleteLikeService } from '../services/likeService';

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('credentials_required');
  }
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await createArticleService(data, req.user.id);

  res.status(201).json(article);
};

export const getArticleDetail = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  const article = await getArticleDetailService(id);

  res.status(200).json(article);
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('credentials_required');
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const article = await getById(id);

  if (!article) {
    throw new NotFoundError('article not found', id);
  }

  if (article.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  const updatedArticle = await updateArticleService(id, data);

  res.status(200).json(updatedArticle);
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('credentials_required');
  }
  const { id } = create(req.params, IdParamsStruct);
  const article = await getById(id);

  if (!article) {
    throw new NotFoundError('article not found', id);
  }

  if (article.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the article');
  }

  await deleteArticleServiec(id);

  res.status(204).json();
  return;
};

export const getArticleList = async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const article = await getArticleListService({ page, pageSize, orderBy, keyword });

  res.status(200).json(article);
};

export const createComment = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('credentials_required');
  }

  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const comment = await createCommentService({ articleId, content, userId: req.user.id });

  res.status(201).send(comment);
};

export const getCommentList = async (req: Request, res: Response): Promise<void> => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const { comments, nextCursor } = await getArticleCommentService({
    articleId,
    cursor,
    limit,
  });

  res.status(200).json({ list: comments, nextCursor });
};

export const createLike = async (req: Request, res: Response) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const createLike = createLikeService(articleId, userId);
  res.status(201).json(createLike);
};

export const deleteLike = async (req: Request, res: Response) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const deleteLike = await deleteLikeService(productId, userId);

  res.status(200).json(deleteLike);
};
