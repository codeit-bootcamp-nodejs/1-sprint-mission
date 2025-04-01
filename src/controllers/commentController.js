import { create } from "superstruct";
import commentService from "../services/commentService.js";
import { catchHandler } from "../lib/catchHandler.js";
import { IdParamsStruct } from "../structs/commonStruct.js";
import {
  UpdateCommentBodyStuct,
  CreateCommentBodyStuct,
  GetCommentList,
} from "../structs/commentStruct.js";

export const patchComment = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, UpdateCommentBodyStuct);
  const comment = await commentService.update(id, content);
  res.status(201).send(comment);
});

export const deleteComment = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteById(id);
  res.sendStatus(204);
});

export const getProductCommentDetatil = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = create(req.params, IdParamsStruct);
  const { cursor, take } = create(req.query, GetCommentList);
  const { comments, nextCursor } = await commentService.getProductId(
    id,
    cursor,
    take,
    userId
  );
  res.status(200).send({ comments, nextCursor });
});

export const createProductComment = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, CreateCommentBodyStuct);
  const comment = await commentService.createProductComment(
    id,
    content,
    userId
  );

  res.status(201).send(comment);
});

export const getArticleCommentDetail = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = create(req.params, IdParamsStruct);
  const { cursor, take } = create(req.body, GetCommentList);
  const { comments, nextCursor } = await commentService.getArticleId(
    id,
    cursor,
    take,
    userId
  );

  res.status(200).send({ comments, nextCursor });
});

export const creatArticleComment = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = create(req.params, IdParamsStruct);
  const content = create(req.body, CreateCommentBodyStuct);
  const comment = await commentService.createArticleComment(
    id,
    content,
    userId
  );
  res.status(201).send(comment);
});
