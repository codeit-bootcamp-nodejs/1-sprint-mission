import NotFoundError from "../lib/error/NotFoundError.js";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepository from "../repositories/productRepository.js";

async function update(id, comment) {
  const findComment = await commentRepository.getById(id);

  if (!findComment) {
    throw new NotFoundError(id);
  }
  return await commentRepository.update(id, comment);
}

async function deleteById(id) {
  const findComment = await commentRepository.getById(id);

  if (!findComment) {
    throw new NotFoundError(id);
  }

  return await commentRepository.deleteById(id);
}

async function getProductId(productId, cursor, take, userId) {
  const findProduct = await productRepository.getById(productId);

  if (!findProduct) {
    throw new NotFoundError(productId);
  }

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
}

async function createProductComment(productId, comment, userId) {
  const findProduct = await productRepository.getById(productId);

  if (!findProduct) {
    throw new NotFoundError(productId);
  }

  const creatComment = await commentRepository.createProductComment(
    productId,
    comment,
    userId
  );

  return creatComment;
}

async function getArticleId(id, cursor, take, userId) {
  const findArticle = await articleRepository.getById(id);

  if (!findArticle) {
    throw new NotFoundError(id);
  }

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
}

async function createArticleComment(articleId, comment, userId) {
  const findArticle = await articleRepository.getById(articleId);

  if (!findArticle) {
    throw new NotFoundError(articleId);
  }

  const creatComment = await commentRepository.createArticleComment(
    articleId,
    comment,
    userId
  );

  return creatComment;
}

export default {
  update,
  deleteById,
  getProductId,
  createProductComment,
  getArticleId,
  createArticleComment,
};
