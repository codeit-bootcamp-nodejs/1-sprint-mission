
import { CommentDTO, UpdateCommentDTO } from "../dto/CommentDTO";
import commentRepository from "../repositories/commentRepository";

const update = async (id: number, comment: UpdateCommentDTO) => {
  return await commentRepository.update(id, comment);
};

const deleteById = async (id: number) => {
  return await commentRepository.deleteById(id);
};

const getProductId = async (
  productId: number,
  cursor: number,
  take: number,
  userId: number
) => {
  const commentData = await commentRepository.getProductId(
    productId,
    cursor,
    take,
    userId
  );

  const comments = commentData.comments;

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;
  return { comments, nextCursor };

};

const createProductComment = async (
  productId: number,
  comment: CommentDTO,
  userId: number
) => {

  const creatComment = await commentRepository.createProductComment(
    productId,
    comment,
    userId
  );

  return creatComment;
};

const getArticleId = async (
  id: number,
  cursor: number,
  take: number,
  userId: number
) => {
  const commentData = await commentRepository.getArticleId(
    id,
    cursor,
    take,
    userId
  );


  const comments = commentData.comments;

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;
  return { comments, nextCursor };
};

const createArticleComment = async (
  articleId: number,
  comment: CommentDTO,
  userId: number
) => {

  const creatComment = await commentRepository.createArticleComment(
    articleId,
    comment,
    userId
  );

  return creatComment;
};

export default {
  update,
  deleteById,
  getProductId,
  createProductComment,
  getArticleId,
  createArticleComment,
};
