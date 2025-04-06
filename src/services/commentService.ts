import { CreateComment, PatchComment } from "../struct";
import { assert } from "superstruct";
import commentRepository from "../repositories/commentRepository";

export type CommentType = "product" | "article";

interface GetCommentsByTypeInput {
  type: CommentType;
  id: string;
  cursor?: string;
  limit?: number;
}

interface CreateCommentInput {
  type: CommentType;
  id: string;
  content: string;
  userId: string;
}

async function getCommentsByType({
  type,
  id,
  cursor,
  limit = 10,
}: GetCommentsByTypeInput) {
  return await commentRepository.getByType({ type, id, cursor, limit });
}

async function createComment({
  type,
  id,
  content,
  userId,
}: CreateCommentInput) {
  assert({ content }, CreateComment);

  const data = {
    content,
    userId,
    ...(type === "product" ? { productId: id } : { articleId: id }),
  };

  return await commentRepository.save(data);
}

async function updateComment(commentId: string, content: string) {
  assert({ content }, PatchComment);
  return await commentRepository.update(commentId, { content });
}

async function deleteComment(commentId: string) {
  await commentRepository.remove(commentId);
}

export default {
  getCommentsByType,
  createComment,
  updateComment,
  deleteComment,
};
