import { JWT_SECRET } from "../lib/constants";
import { expressjwt } from "express-jwt";
import { prismaClient } from "../lib/prismaClient";
import { Request, Response, NextFunction } from "express";

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
export async function verifyProductAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 상품아이디
  const { id: productId } = req.params;
  const productIdInt = parseInt(productId, 10);

  const product = await prismaClient.product.findUnique({
    where: { id: productIdInt },
  });
  // 상품id값확인
  if (!product) {
    throw new Error("product not found");
  }
  if (!req.user) {
    throw new Error("user not found");
  }

  // product모델의 userid값과 요청한 유저 아이디값
  if (product.userId !== req.user.id) {
    throw new Error("forbbiden");
  }
  return next();
}

export async function verifyAricleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: articleId } = req.params;
  const articleIdInt = parseInt(articleId, 10);
  try {
    const article = await prismaClient.article.findUnique({
      where: { id: articleIdInt },
    });
    if (!article) {
      throw new Error("product not found");
    }

    if (!req.user) {
      throw new Error("user not found");
    }

    if (article.userId !== req.user.id) {
      throw new Error("forbbiden");
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyCommentAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: commentId } = req.params;
  const commentIdInt = parseInt(commentId, 10);
  try {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentIdInt },
    });
    if (!comment) {
      throw new Error("comment not found");
    }
    if (!req.user) {
      throw new Error("user not found");
    }
    if (comment.userId !== req.user.id) {
      throw new Error("forbbiden");
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
