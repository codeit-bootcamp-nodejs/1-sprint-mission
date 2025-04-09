import { Comment, Prisma } from '@prisma/client';

type OrderByOption = 'recent' | 'oldest' | undefined;

export interface ParamsDTO {
  page: number;
  pageSize: number;
  orderBy?: OrderByOption;
  keyword?: string;
  currentUserId?: number;
}

export interface cursorPagenation {
  comments: Comment[];
  nextCursor: number | null;
}

export interface GetArticleListDTO {
  page: number;
  pageSize: number;
  orderBy: 'recent' | 'oldest';
  where: Prisma.ArticleWhereInput;
}

export interface GetProductListDTO {
  page: number;
  pageSize: number;
  orderBy: 'recent' | 'oldest';
  where: Prisma.ProductWhereInput;
}
