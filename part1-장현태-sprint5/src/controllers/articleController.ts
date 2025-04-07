import {
  fetchArticles,
  getArticleById,
  createNewArticle,
  updateArticleById,
  removeArticleById,
  cancelArticleLike,
  addArticleLike,
} from "../services/article";
import { assert } from "superstruct";
import { createArticle as createArticleSchema } from "../config/requestValidation";
import { RequestHandler } from "express";

export const getArticleList: RequestHandler = async function (req, res, next) {
  try {
    const query = {
      offset: (req.query.offset as string | undefined) ?? "0",
      limit: (req.query.limit as string | undefined) ?? "10",
      order: (req.query.order as string | undefined) ?? "newest",
      search: (req.query.search as string | undefined) ?? "",
    };
    const articles = await fetchArticles(query);
    return res.json(articles);
  } catch (error) {
    next(error);
  }
};

export const getArticle: RequestHandler = async function (req, res, next) {
  try {
    const article = await getArticleById(req.params.id);
    return res.json(article);
  } catch (error) {
    next(error);
  }
};

export const postArticle: RequestHandler = async function (req, res, next) {
  try {
    assert(req.body, createArticleSchema);
    const newArticle = await createNewArticle(req.user!.userId, req.body);
    return res.json(newArticle);
  } catch (error) {
    next(error);
  }
};

export const patchArticle: RequestHandler = async function (req, res, next) {
  try {
    const updatedArticle = await updateArticleById(req.params.id, req.body);
    return res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

export const deleteArticle: RequestHandler = async function (req, res, next) {
  try {
    await removeArticleById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const postArticleLike: RequestHandler = async function (req, res, next) {
  try {
    await addArticleLike(req.user!.userId, req.params.id);
    return res.json({ message: "Like it!" });
  } catch (error) {
    next(error);
  }
};

export const deleteArticleLike: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    await cancelArticleLike(req.user!.userId, req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
