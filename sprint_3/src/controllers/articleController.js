import { create } from "superstruct";
import articleService from "../services/articleService.js";
import {
  CreateArticleBodyStuct,
  GetArticleList,
  UpdateArticleBodyStuct,
} from "../structs/articleStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";

export const getArticle = async (req, res) => {
  const { page, pageSize, orderBy, search } = create(req.query, GetArticleList);
  const articles = await articleService.getAll({
    page,
    pageSize,
    orderBy,
    search,
  });
  res.status(200).send(articles);
  
};

export const getUserArticle = async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, pageSize = 10, orderBy } = req.query;
  const articles = await articleService.getAll({
    page,
    pageSize,
    orderBy,
    userId,
  });
  res.status(200).send(articles);
};

export const createArticle = async (req, res) => {
  const userId = req.user.userId;
  const data = create(req.body, CreateArticleBodyStuct);
  const article = await articleService.create({ data, authorId: userId });
  res.status(201).send(article);
};

export const getArticleDetail = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getById(id);
  res.status(200).send(article);
};

export const patchArticle = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, UpdateArticleBodyStuct);
  const article = await articleService.update(id, content);
  res.status(201).send(article);
};

export const deleteArticle = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.deleteById(id);
  res.sendStatus(204);
};
