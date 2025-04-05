import articleRepository from "../repositories/articleRepository.js"; // articleRepository import
import likeRepository from "../repositories/likeRepository.js"; // likeRepository import
import { CreateArticle, PatchArticle } from "../struct.js";
import { assert } from "superstruct";

async function getAllArticles({
  offset = 0,
  limit = 10,
  order = "recent",
  search = "",
}) {
  let orderBy = { createdAt: "desc" };

  if (order === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  return await articleRepository.getAllArticles({
    offset,
    limit,
    orderBy,
    search,
  });
}

async function createArticle(data, userId) {
  assert(data, CreateArticle);
  const { title, content } = data;

  return await articleRepository.save({ title, content, userId });
}

async function getArticleById(id) {
  return await articleRepository.getById(id);
}

async function updateArticle(id, data, userId) {
  assert(data, PatchArticle);
  const { title, content } = data;

  const article = await articleRepository.getById(id);

  if (!article) {
    throw new Error("Article not found");
  }
  if (article.userId !== userId) {
    throw new Error("You do not have permission to update this article");
  }

  return await articleRepository.update(id, { title, content });
}

async function deleteArticle(id, userId) {
  const article = await articleRepository.getById(id);

  if (!article) {
    throw new Error("Article not found");
  }
  if (article.userId !== userId) {
    throw new Error("You do not have permission to delete this article");
  }

  return await articleRepository.remove(id);
}

async function toggleLike(userId, articleId) {
  const existingLike = await likeRepository.findLike(userId, articleId);

  if (existingLike) {
    await likeRepository.removeLike(existingLike.id);
    return { message: "Like removed" };
  }

  const newLike = await likeRepository.saveLike(userId, articleId);
  return { message: "Like added", article: newLike };
}

export default {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  toggleLike,
};
