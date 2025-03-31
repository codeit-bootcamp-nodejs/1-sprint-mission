import articleRepository from "../repositories/articleRepository.js";
import likeRepository from "../repositories/likeRepository.js";

export async function fetchArticles(query) {
  return await articleRepository.getAll(query);
}

export async function getArticleById(userId) {
  return await articleRepository.getById(userId);
}

export async function createNewArticle(userId, articleData) {
  return await articleRepository.save(userId, articleData);
}

export async function updateArticleById(id, updateData) {
  return await articleRepository.update(id, updateData);
}

export async function removeArticleById(id) {
  return await articleRepository.deleteById(id);
}

export async function addArticleLike(userId, articleId) {
  await likeRepository.saveArticleLike(userId, articleId);
  return;
}

export async function cancelArticleLike(userId, articleId) {
  await likeRepository.deleteArticleLike(userId, articleId);
  return;
}
