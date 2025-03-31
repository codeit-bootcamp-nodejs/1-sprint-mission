import { expressjwt } from "express-jwt";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepository from "../repositories/productRepository.js";

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

export async function verifyArticleAuthor(req, res, next) {
  const { id: articleId } = req.params;
  const { userId } = req.user;
  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      const error = new Error(`article ${articleId} not found`);
      error.data = 404;
      throw error;
    }

    if (article.authorId !== userId) {
      const error = new Error("Forbidden");
      error.data = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyProductAuthor(req, res, next) {
  const { id: productId } = req.params;
  const { userId } = req.user;
  try {
    console.log("userid");
    console.log(userId);
    const product = await productRepository.getById(productId);
    if (!product) {
      const error = new Error(`product ${productId} not found`);
      error.data = 404;
      throw error;
    }

    if (product.authorId !== userId) {
      const error = new Error("Forbidden");
      error.data = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyCommentAuthor(req, res, next) {
  const { id: commentId } = req.params;
  const { userId } = req.user;
  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error = new Error(`comment ${commentId} not found`);
      error.data = 404;
      throw error;
    }

    if (comment.authorId !== userId) {
      const error = new Error("Forbidden");
      error.data = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
