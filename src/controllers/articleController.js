import { create } from "superstruct";
import articleService from "../services/articleService.js";
import { catchHandler } from "../lib/catchHandler.js";
import {
  CreateArticleBodyStuct,
  GetArticleList,
  UpdateArticleBodyStuct,
} from "../structs/articleStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";

export const getArticle = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page, pageSize, orderBy, search } = create(req.query, GetArticleList);
  const articles = await articleService.getAll({
    page,
    pageSize,
    orderBy,
    search,
    userId,
  });
  res.status(200).send(articles);
});

export const createArticle = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = create(req.body, CreateArticleBodyStuct);
  const article = await articleService.create({ data, authorId: userId });
  res.status(201).send(article);
});

export const getArticleDetail = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getById(id);
  res.status(200).send(article);
});

export const patchArticle = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, UpdateArticleBodyStuct);
  const article = await articleService.update(id, content);
  res.status(201).send(article);
});

export const deleteArticle = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.deleteById(id);
  res.sendStatus(204);
});
