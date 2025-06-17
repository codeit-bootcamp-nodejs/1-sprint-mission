
import { ArticleDTO, UpdateArticleDTO } from "../dto/ArticleDTO";
import NotFoundError from "../lib/error/NotFoundError";
import articleRepository from "../repositories/articleRepository";

const getAll = async (
  page: number,
  pageSize: number,
  orderBy: string,
  search?: string
) => {
  const articles = await articleRepository.getAll(
    page,
    pageSize,
    orderBy,
    search
  );

  return articles;
};

const create = async (data: ArticleDTO, authorId: number) => {
  return articleRepository.save(data, authorId);
};

const getById = async (id: number) => {
  const article = await articleRepository.getById(id);

  if (!article) {
    throw new NotFoundError("게시글");
  }
  return article;
};

const update = async (id: number, article: UpdateArticleDTO) => {
  return await articleRepository.update(id, article);
};

const deleteById = async (id: number) => {
  return await articleRepository.deleteById(id);
};
export default { getAll, create, getById, update, deleteById };
