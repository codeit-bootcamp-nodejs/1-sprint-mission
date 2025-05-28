import { expressjwt } from "express-jwt";
import articleRepository from "../repositories/articleRepository";
import commentRepository from "../repositories/commentRepository";
import productRepository from "../repositories/productRepository";
import { RequestHandler } from "express";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const verifyAccessToken = expressjwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "user",
});

export const verifyRefreshToken = expressjwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

export const verifyArticleAuthor: RequestHandler = async function (
  req,
  res,
  next
) {
  const { id: articleId } = req.params;
  const userId = req.user?.userId;
  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      const error = new Error(`article ${articleId} not found`);
      throw error;
    }

    if (article.authorId !== Number(userId)) {
      const error = new Error("Forbidden");
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const verifyProductAuthor: RequestHandler = async function (
  req,
  res,
  next
) {
  const { id: productId } = req.params;
  const userId = req.user?.userId;
  try {
    const product = await productRepository.getById(productId);
    if (!product) {
      const error = new Error(`product ${productId} not found`);
      throw error;
    }

    if (product.authorId !== Number(userId)) {
      const error = new Error("Forbidden");
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const verifyCommentAuthor: RequestHandler = async function (
  req,
  res,
  next
) {
  const { id: commentId } = req.params;
  const userId = req.user?.userId;
  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error = new Error(`comment ${commentId} not found`);
      throw error;
    }

    if (comment.authorId !== Number(userId)) {
      const error = new Error("Forbidden");
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};