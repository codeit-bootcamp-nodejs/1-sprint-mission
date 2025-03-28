import {
  fetchArticles,
  getArticleById,
  createNewArticle,
  updateArticleById,
  removeArticleById,
  cancelArticleLike,
  addArticleLike,
} from "../services/article.js";
import { assert } from "superstruct";
import { createArticle as createArticleSchema } from "../config/requestValidation.js";

export async function getArticleList(req, res, next) {
  try {
    const articles = await fetchArticles(req.query);
    return res.json(articles);
  } catch (error) {
    next(error);
  }
}

export async function getArticle(req, res, next) {
  try {
    const article = await getArticleById(req.params.id);
    return res.json(article);
  } catch (error) {
    next(error);
  }
}

export async function postArticle(req, res, next) {
  try {
    assert(req.body, createArticleSchema);
    const newArticle = await createNewArticle(req.user.userId, req.body);
    return res.json(newArticle);
  } catch (error) {
    next(error);
  }
}

export async function patchArticle(req, res, next) {
  try {
    const updatedArticle = await updateArticleById(req.params.id, req.body);
    return res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(req, res, next) {
  try {
    await removeArticleById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function postArticleLike(req, res, next) {
  try {
    await addArticleLike(req.user.userId, req.params.id);
    return res.json({ message: "Like it!" });
  } catch (error) {
    next(error);
  }
}

export async function deleteArticleLike(req, res, next) {
  try {
    await cancelArticleLike(req.user.userId, req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}
