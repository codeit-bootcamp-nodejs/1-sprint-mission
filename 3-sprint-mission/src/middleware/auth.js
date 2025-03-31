import { JWT_SECRET } from "../lib/constants.js";
import { expressjwt } from "express-jwt";
import { prismaClient } from "../lib/prismaClient.js";

// express-jwt 내부에서 next호출
// bearer에 있는 jwt가 검증이 되면 requestProperty에 저장
export const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

// comment, article, product 인가
export async function verifyProductAuth(req, res, next) {
  // 상품아이디
  const { id: productId } = req.params;
  const productIdInt = parseInt(productId, 10);

  const product = await prismaClient.product.findUnique({
    where: { id: productIdInt },
  });
  // 상품id값확인
  if (!product) {
    const error = new Error("product not found");
    error.code = 404;
    throw error;
  }
  // product모델의 userid값과 요청한 유저 아이디값
  if (product.userId !== req.user.userId) {
    const error = new Error("forbbiden");
    error.code = 403;
    throw error;
  }
  return next();
}

export async function verifyAricleAuth(req, res, next) {
  const { id: articleId } = req.params;
  const articleIdInt = parseInt(articleId, 10);
  try {
    const article = await prismaClient.article.findUnique({
      where: { id: articleIdInt },
    });
    if (!article) {
      const error = new Error("product not found");
      error.code = 404;
      throw error;
    }
    if (article.userId !== req.user.userId) {
      const error = new Error("forbbiden");
      error.code = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyCommentAuth(req, res, next) {
  const { id: commentId } = req.params;
  const commentIdInt = parseInt(commentId, 10);
  try {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentIdInt },
    });
    if (!comment) {
      const error = new Error("comment not found");
      error.code = 404;
      throw error;
    }
    if (comment.userId !== req.user.userId) {
      const error = new Error("forbbiden");
      error.code = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
