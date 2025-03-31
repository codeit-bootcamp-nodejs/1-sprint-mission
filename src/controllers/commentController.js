import commentService from "../services/commentService.js";
import asyncHandler from "../utils/asyncHandler.js";

const getComments = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { cursor, limit } = req.query;
  const comments = await commentService.getCommentsByType({
    type,
    id,
    cursor,
    limit,
  });
  res.status(200).send(comments);
});

const createComment = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { content } = req.body;
  const { userId } = req.user;
  const createdComment = await commentService.createComment({
    type,
    id,
    content,
    userId,
  });
  res.status(200).send(createdComment);
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const updatedComment = await commentService.updateComment(commentId, content);
  res.status(200).send(updatedComment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await commentService.deleteComment(commentId);
  res.status(200).send({ message: "Comment deleted successfully" });
});

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
