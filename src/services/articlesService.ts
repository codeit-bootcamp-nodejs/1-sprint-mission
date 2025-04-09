import {
  ArticleLikeDTO,
  CreateArticleDTO,
  GetArticleDTO,
  UpdateArticleDTO,
} from '../DTO/articleDTO';
import { CreateArticleCommentDTO } from '../DTO/commentDTO';
import { cursorPagenation, ParamsDTO } from '../DTO/commonDTO';
import { likeArticleDTO } from '../DTO/likeDTO';
import NotFoundError from '../lib/errors/NotFoundError';
import {
  createArticle,
  deleteArticle,
  getArticles,
  getById,
  updateArticle,
} from '../repositories/articlesRepository';
import { createArticleComment, getArticleComment } from '../repositories/commentRepository';

export const createArticleService = async (
  data: CreateArticleDTO,
  userId: number,
): Promise<CreateArticleDTO> => {
  const articleData = {
    ...data,
    user: {
      connect: {
        id: userId,
      },
    },
  };

  return await createArticle(articleData);
};

export const getArticleDetailService = async (
  articleId: number,
  userId?: number,
): Promise<ArticleLikeDTO> => {
  const article = await getById(articleId);

  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const isLiked = userId ? article.likes.some((like) => like.userId === userId) : undefined;

  return {
    ...article,
    likeCount: article.likes.length,
    isLiked,
  };
};

export const updateArticleService = async (
  id: number,
  data: UpdateArticleDTO,
): Promise<UpdateArticleDTO> => {
  const existingArticle = await getById(id);

  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  return await updateArticle(id, data);
};

export const deleteArticleServiec = async (id: number): Promise<void> => {
  const existingArticle = await getById(id);

  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  await deleteArticle(id);
};

export const getArticleListService = async (
  params: ParamsDTO,
  userId?: number,
): Promise<GetArticleDTO[]> => {
  const { page, pageSize, orderBy, keyword } = params;

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const articles = await getArticles({ page, pageSize, orderBy: 'recent', where });

  const articleList = articles.map((article) => likeArticleDTO(article, userId));

  return articleList;
};

export async function createCommentService({
  id,
  articleId,
  content,
  userId,
}: CreateArticleCommentDTO): Promise<CreateArticleCommentDTO> {
  const existingArticle = await getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const comment = await createArticleComment({ id, articleId, content, userId });

  return {
    id: comment.id,
    articleId: comment.articleId!,
    content: comment.content,
    userId: comment.userId,
  };
}

export async function getArticleCommentService({
  articleId,
  cursor,
  limit,
}: {
  articleId: number;
  cursor?: number;
  limit: number;
}): Promise<cursorPagenation> {
  const article = await getById(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const getComment = await getArticleComment(articleId, cursor, limit);
  const comments = getComment.slice(0, limit);
  const cursorComment = getComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return { comments, nextCursor };
}
