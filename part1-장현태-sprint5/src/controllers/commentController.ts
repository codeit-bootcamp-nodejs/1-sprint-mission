import {
  fetchComments,
  addCommentToArticle,
  addCommentToProduct,
  updateCommentById,
  removeCommentById,
} from "../services/comment";
import { RequestHandler } from "express";

export const getCommentList: RequestHandler = async function (req, res, next) {
  try {
    const comments = await fetchComments();
    return res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const postArticleComment: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const commentData = { ...req.body, articleId: req.params.id };
    const comment = await addCommentToArticle(req.user!.userId, commentData);
    return res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const postProductComment: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const commentData = { ...req.body, productId: req.params.id };
    const comment = await addCommentToProduct(req.user!.userId, commentData);
    return res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const patchComment: RequestHandler = async function (req, res, next) {
  try {
    const updatedComment = await updateCommentById(req.params.id, req.body);
    return res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment: RequestHandler = async function (req, res, next) {
  try {
    await removeCommentById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
