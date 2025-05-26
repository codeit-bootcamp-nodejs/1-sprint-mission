import {
  fetchArticles,
  getArticleById,
  createNewArticle,
  updateArticleById,
  removeArticleById,
  cancelArticleLike,
  addArticleLike,
} from "../services/articleService";
import { assert } from "superstruct";
import { createArticle as createArticleSchema } from "../config/requestValidation";
import { RequestHandler } from "express";

export const getArticleList: RequestHandler = async function (req, res, next) {
  const query = {
    offset: (req.query.offset as string | undefined) ?? "0",
    limit: (req.query.limit as string | undefined) ?? "10",
    order: (req.query.order as string | undefined) ?? "newest",
    search: (req.query.search as string | undefined) ?? "",
  };
  const articles = await fetchArticles(query);
  return res.json(articles);
};

export const getArticle: RequestHandler = async function (req, res, next) {
  const article = await getArticleById(req.params.id);
  return res.json(article);
};

export const postArticle: RequestHandler = async function (req, res, next) {
  assert(req.body, createArticleSchema);
  const newArticle = await createNewArticle(req.user!.userId, req.body);
  return res.json(newArticle);
};

export const patchArticle: RequestHandler = async function (req, res, next) {
  const updatedArticle = await updateArticleById(req.params.id, req.body);
  return res.json(updatedArticle);
};

export const deleteArticle: RequestHandler = async function (req, res, next) {
  await removeArticleById(req.params.id);
  return res.status(204).end();
};

export const postArticleLike: RequestHandler = async function (req, res, next) {
  await addArticleLike(req.user!.userId, req.params.id);
  return res.json({ message: "Like it!" });
};

export const deleteArticleLike: RequestHandler = async function (
  req,
  res,
  next
) {
  await cancelArticleLike(req.user!.userId, req.params.id);
  return res.status(204).end();
};
