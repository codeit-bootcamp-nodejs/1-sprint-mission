import {
  fetchComments,
  addCommentToArticle,
  addCommentToProduct,
  updateCommentById,
  removeCommentById,
} from "../services/comment.js";

export async function getCommentList(req, res, next) {
  try {
    const comments = await fetchComments();
    return res.json(comments);
  } catch (error) {
    next(error);
  }
}

export async function postArticleComment(req, res, next) {
  try {
    const commentData = { ...req.body, articleId: req.params.id };
    const comment = await addCommentToArticle(req.user.userId, commentData);
    return res.json(comment);
  } catch (error) {
    next(error);
  }
}

export async function postProductComment(req, res, next) {
  try {
    const commentData = { ...req.body, productId: req.params.id };
    const comment = await addCommentToProduct(req.user.userId, commentData);
    return res.json(comment);
  } catch (error) {
    next(error);
  }
}

export async function patchComment(req, res, next) {
  try {
    const updatedComment = await updateCommentById(req.params.id, req.body);
    return res.json(updatedComment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    await removeCommentById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}
