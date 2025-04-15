import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepository from "../repositories/productRepository.js";
import { catchHandler } from "./catchHandler.js";

export const verifyProductAuth = async (req, res, next) => {
  const { id: productId } = req.params;
  const userId = req.user.userId;
  const product = await productRepository.getById(productId);

  if (!product) {
    const error = new Error("제품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  if (product.authorId !== userId) {
    const error = new Error("Forbidden");
    error.code = 403;
    throw error;
  }
  return next();
};

export const verifyArticleAuth = catchHandler(async (req, res, next) => {
  const { id: articleId } = req.params;
  const userId = req.user.userId;
  const article = await articleRepository.getById(articleId);

  if (!article) {
    const error = new Error("제품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  if (article.authorId !== userId) {
    const error = new Error("Forbidden");
    error.code = 403;
    throw error;
  }
  return next();
});

export const verifycommentAuth = catchHandler(async (req, res, next) => {
  const { id: commentId } = req.params;
  const userId = req.user.userId;
  const comment = await commentRepository.getById(commentId);

  if (!comment) {
    const error = new Error("제품을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }

  if (comment.authorId !== userId) {
    const error = new Error("Forbidden");
    error.code = 403;
    throw error;
  }
  return next();
});
