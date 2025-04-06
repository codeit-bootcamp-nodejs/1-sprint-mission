import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";

import productRepository from "../repositories/productRepository";
import articleRepository from "../repositories/articleRepository";
import commentRepository from "../repositories/commentRepository";

interface AuthedUser {
  userId: string;
  id?: string;
}

interface AuthedRequest extends Request {
  user: {
    id: string;
    userId: string;
  };
}

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  requestProperty: "user",
});

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

function throwError(message: string, code: number): never {
  const error = new Error(message) as Error & { code: number };
  error.code = code;
  throw error;
}

export async function verifyProductAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const { id: productId } = req.params;
  const { userId } = req.user;

  try {
    const product = await productRepository.getById(productId);
    if (!product) throwError("Product not found", 404);
    if (product.userId !== userId) throwError("Forbidden", 403);

    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyArticleAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const { id: articleId } = req.params;
  const { userId } = req.user;

  try {
    const article = await articleRepository.getById(articleId);
    if (!article) throwError("Article not found", 404);
    if (article.userId !== userId) throwError("Forbidden", 403);

    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyCommentAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.params;
  const { userId } = req.user;

  try {
    const comment = await commentRepository.getById(commentId);
    if (!comment) throwError("Comment not found", 404);
    if (comment.userId !== userId) throwError("Forbidden", 403);

    next();
  } catch (error) {
    next(error);
  }
}

const auth = {
  verifyAccessToken,
  verifyProductAuth,
  verifyArticleAuth,
  verifyCommentAuth,
};

export default auth;
