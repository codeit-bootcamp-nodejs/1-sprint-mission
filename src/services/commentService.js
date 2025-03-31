import { CreateComment, PatchComment } from "../struct.js";
import { assert } from "superstruct";
import commentRepository from "../repositories/commentRepository.js";

async function getCommentsByType({ type, id, cursor, limit = 10 }) {
  return await commentRepository.getByType({ type, id, cursor, limit });
}

async function createComment({ type, id, content, userId }) {
  assert({ content }, CreateComment);

  const data = {
    content,
    userId,
    ...(type === "product" ? { productId: id } : { articleId: id }),
  };

  return await commentRepository.save(data);
}

async function updateComment(commentId, content) {
  assert({ content }, PatchComment);
  return await commentRepository.update(commentId, { content });
}

async function deleteComment(commentId) {
  await commentRepository.remove(commentId);
}

export default {
  getCommentsByType,
  createComment,
  updateComment,
  deleteComment,
};
