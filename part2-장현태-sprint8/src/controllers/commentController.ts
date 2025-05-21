import {
  fetchComments,
  addCommentToArticle,
  addCommentToProduct,
  updateCommentById,
  removeCommentById,
} from "../services/commentService";
import { RequestHandler } from "express";

export const getCommentList: RequestHandler = async function (req, res, next) {
  const comments = await fetchComments();
  return res.json(comments);
};

export const postArticleComment: RequestHandler = async function (
  req,
  res,
  next
) {
  const commentData = { ...req.body, articleId: req.params.id };
  const comment = await addCommentToArticle(
    Number(req.user!.userId),
    commentData
  );
  return res.json(comment);
};

export const postProductComment: RequestHandler = async function (
  req,
  res,
  next
) {
  const commentData = { ...req.body, productId: req.params.id };
  const comment = await addCommentToProduct(req.user!.userId, commentData);
  return res.json(comment);
};

export const patchComment: RequestHandler = async function (req, res, next) {
  const updatedComment = await updateCommentById(req.params.id, req.body);
  return res.json(updatedComment);
};

export const deleteComment: RequestHandler = async function (req, res, next) {
  await removeCommentById(req.params.id);
  return res.status(204).end();
};
