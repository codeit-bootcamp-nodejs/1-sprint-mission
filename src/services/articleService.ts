import articleRepository from "../repositories/articleRepository";
import likeRepository from "../repositories/likeRepository";
import { CreateArticle, PatchArticle } from "../struct";
import { assert } from "superstruct";

interface ArticleQuery {
  offset?: number;
  limit?: number;
  order?: "recent" | "oldest";
  search?: string;
}

async function getAllArticles({
  offset = 0,
  limit = 10,
  order = "recent",
  search = "",
}: ArticleQuery) {
  let orderBy: { createdAt: "asc" | "desc" } = { createdAt: "desc" };
  if (order === "oldest") orderBy = { createdAt: "asc" };

  return await articleRepository.getAllArticles({
    offset,
    limit,
    orderBy,
    search,
  });
}

async function createArticle(data: unknown, userId: string) {
  assert(data, CreateArticle);
  const { title, content } = data as { title: string; content: string };
  return await articleRepository.save({ title, content, userId });
}

async function getArticleById(id: string) {
  return await articleRepository.getById(id);
}

async function updateArticle(id: string, data: unknown, userId: string) {
  assert(data, PatchArticle);
  const { title, content } = data as { title?: string; content?: string };

  const article = await articleRepository.getById(id);
  if (!article)
    throw Object.assign(new Error("Article not found"), { code: 404 });
  if (article.userId !== userId)
    throw Object.assign(
      new Error("You do not have permission to update this article"),
      { code: 403 }
    );

  return await articleRepository.update(id, { title, content });
}

async function deleteArticle(id: string, userId: string) {
  const article = await articleRepository.getById(id);
  if (!article)
    throw Object.assign(new Error("Article not found"), { code: 404 });
  if (article.userId !== userId)
    throw Object.assign(
      new Error("You do not have permission to delete this article"),
      { code: 403 }
    );

  return await articleRepository.remove(id);
}

async function toggleLike(userId: string, articleId: string) {
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
