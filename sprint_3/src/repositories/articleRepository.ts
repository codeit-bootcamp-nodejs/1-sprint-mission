import prisma from "../config/prisma";
import { ArticleDTO, UpdateArticleDTO } from "../dto/ArticleDTO";

const getAll = async (
  page: number,
  pageSize: number,
  orderBy: string,
  search?: string
) => {
  const where = search
    ? {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }
    : {};
  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalCount = await prisma.article.count({ where });

  return { articles, totalCount };
};

const save = async (data: ArticleDTO, authorId: number) => {
  const createdArticle = await prisma.article.create({
    data: {
      ...data,
      author: { connect: { id: authorId } },

    },
  });

  return createdArticle;

};

const getById = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });
  return article;
};

const update = async (id: number, article: UpdateArticleDTO) => {

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      title: article.title,
      content: article.content,
    },
  });


  return updatedArticle;
};

const deleteById = async (id: number) => {

  const article = await prisma.article.delete({
    where: { id },
  });

  return article;
};

export default { getAll, save, getById, update, deleteById };
