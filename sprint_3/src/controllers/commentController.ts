import { create } from "superstruct";
import commentService from "../services/commentService";
import { IdParamsStruct } from "../structs/commonStruct";
import {
  CreateCommentBodyStruct,
  GetCommentList,
  UpdateCommentBodyStruct,
} from "../structs/commentStruct";
import { RequestHandler } from "express";
import productService from "../services/productService";
import notificationService from "../services/notificationService";
import { sendNotificationToUser } from "../services/websocket";
import { Type } from "@prisma/client";
import articleService from "../services/articleService";

export const patchComment: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, UpdateCommentBodyStruct);
  const comment = await commentService.update(id, content);
  res.status(201).send(comment);
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteById(id);
  res.sendStatus(204);
};

export const getProductCommentList: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const { id } = create(req.params, IdParamsStruct);
  const { cursor, take } = create(req.query, GetCommentList);
  const { comments, nextCursor } = await commentService.getProductId(
    id,
    cursor,
    take,
    userId
  );
  res.status(200).send({ comments, nextCursor });
};

export const createProductComment: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, CreateCommentBodyStruct);
  const comment = await commentService.createProductComment(
    id,
    content,
    userId
  );

  const product = await productService.getById(id);
  const notification = await notificationService.create(
    product.authorId,
    "COMMENT" as Type
  );
  await Promise.all(
    notification.map((noti) =>
      sendNotificationToUser(noti.userId, noti.content)
    )
  );

  res.status(201).send(comment);
};

export const getArticleCommentList: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const { id } = create(req.params, IdParamsStruct);
  const { cursor, take } = create(req.query, GetCommentList);
  const { comments, nextCursor } = await commentService.getArticleId(
    id,
    cursor,
    take,
    userId
  );

  res.status(200).send({ comments, nextCursor });
};

export const creatArticleComment: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, CreateCommentBodyStruct);
  const comment = await commentService.createArticleComment(
    id,
    content,
    userId
  );

  const article = await articleService.getById(id);
  const notification = await notificationService.create(
    article.authorId,
    "COMMENT" as Type
  );

  await Promise.all(
    notification.map((noti) =>
      sendNotificationToUser(noti.userId, noti.content)
    )
  );

  res.status(201).send(comment);
};
