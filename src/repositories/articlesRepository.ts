import { Article, Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { GetArticleListDTO } from '../DTO/commonDTO';

export async function createArticle(data: Prisma.ArticleCreateInput): Promise<Article> {
  return await prismaClient.article.create({
    data,
  });
}

type ArticleWithLikes = Prisma.ArticleGetPayload<{
  include: { likes: true };
}>;
export async function getById(id: number): Promise<ArticleWithLikes | null> {
  return await prismaClient.article.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });
}

export async function updateArticle(id: number, data: Prisma.ArticleUpdateInput): Promise<Article> {
  return await prismaClient.article.update({
    where: { id },
    data,
  });
}

export async function deleteArticle(id: number): Promise<Article> {
  return await prismaClient.article.delete({
    where: { id },
  });
}

export const getArticles = ({ page, pageSize, orderBy, where }: GetArticleListDTO) => {
  return prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: { likes: true },
  });
};
