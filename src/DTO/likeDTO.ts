import { Article, Like } from '@prisma/client';
import { GetArticleDTO } from './articleDTO';

interface ArticleLikes extends Article {
  likes: Like[];
}

export const likeArticleDTO = (article: ArticleLikes, userId?: number): GetArticleDTO => {
  return {
    ...article,
    likeCount: article.likes.length,
    isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined,
  };
};
