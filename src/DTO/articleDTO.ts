import { Article } from '@prisma/client';

export interface CreateArticleDTO {
  title: string;
  content: string;
  image: string | null;
}

export interface GetArticleDTO {
  title: string;
  content: string;
  image: string | null;
  userId: number;
  likeCount: number;
  isLiked?: boolean;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  image?: string | null;
}

export type ArticleLikeDTO = Article & {
  likeCount: number;
  isLiked?: boolean;
};
