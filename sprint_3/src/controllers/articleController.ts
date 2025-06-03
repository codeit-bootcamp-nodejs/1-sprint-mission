import { RequestHandler } from "express";
import { create } from "superstruct";
import articleService from "../services/articleService";
import {
  CreateArticleBodyStuct,
  GetArticleList,
  UpdateArticleBodyStuct,
} from "../structs/articleStruct";
import { IdParamsStruct } from "../structs/commonStruct";

export const getArticle: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy, search } = create(req.query, GetArticleList);
  const articles = await articleService.getAll(page, pageSize, orderBy, search);
  res.status(200).send(articles);
};

export const createArticle: RequestHandler = async (req, res) => {
  const userId = req.user.id;

  const data = create(req.body, CreateArticleBodyStuct);
  const article = await articleService.create(data, userId);

  res.status(201).send(article);
};

export const getArticleDetail: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getById(id);
  res.status(200).send(article);
};

export const patchArticle: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, UpdateArticleBodyStuct);
  const article = await articleService.update(id, content);
  res.status(201).send(article);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteById(id);
  res.sendStatus(204);
};
