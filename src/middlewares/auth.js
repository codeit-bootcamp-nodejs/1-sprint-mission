import productRepository from "../repositories/productRepository.js";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";

import { expressjwt } from "express-jwt";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

function throwUnauthorizedError() {
  const error = new Error("Unauthorized");
  error.code = 401;
  throw error;
}

async function verifyProductAuth(req, res, next) {
  const { id: productId } = req.params;
  const { userId } = req.user;
  console.log("userId", userId);
  try {
    const product = await productRepository.getById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.code = 404;
      throw error;
    }

    if (product.userId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function verifyArticleAuth(req, res, next) {
  const { id: articleId } = req.params;
  const { userId } = req.user;
  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      const error = new Error("Article not found");
      error.code = 404;
      throw error;
    }

    if (article.userId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function verifyCommentAuth(req, res, next) {
  const { commentId } = req.params;
  const { userId } = req.user;
  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error = new Error("Comment not found");
      error.code = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default {
  verifyAccessToken,
  verifyProductAuth,
  verifyArticleAuth,
  verifyCommentAuth,
};
