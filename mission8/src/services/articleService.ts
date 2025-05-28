import { number } from "superstruct";
import articleRepository from "../repositories/articleRepository";

export async function fetchArticles(query: {
  offset: string;
  limit: string;
  order: string;
  search: string;
}) {
  return await articleRepository.getAll(query);
}

export async function getArticleById(id: string) {
  return await articleRepository.getById(id);
}

export async function createNewArticle(
  userId: string,
  articleData: {
    title: string;
    content: string;
  }
) {
  return await articleRepository.save(Number(userId), articleData);
}

export async function updateArticleById(
  id: string,
  updateData: {
    title: string;
    content: string;
  }
) {
  return await articleRepository.update(id, updateData);
}

export async function removeArticleById(id: string) {
  return await articleRepository.deleteById(id);
}