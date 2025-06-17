
import { RequestHandler } from "express";
import { create } from "superstruct";
import articleRepository from "../repositories/articleRepository";
import commentRepository from "../repositories/commentRepository";
import productRepository from "../repositories/productRepository";
import { catchHandler } from "./catchHandler";
import NotFoundError from "./error/NotFoundError";
import ForbiddenError from "./error/ForbiddenError";
import { IdParamsStruct } from "../structs/commonStruct";

export const verifyProductAuth: RequestHandler = async (req, res, next) => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user.id;
  const product = await productRepository.getById(id);

  if (!product) {
    return next(new NotFoundError("제품"));
  }

  if (product.authorId !== userId) {
    return next(new ForbiddenError("작성자 외에는 수정할 수 없습니다."));
  }
  return next();
};

export const verifyArticleAuth: RequestHandler = catchHandler(
  async (req, res, next) => {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;
    const article = await articleRepository.getById(id);

    if (!article) {
      return next(new NotFoundError("게시글"));
    }

    if (article.authorId !== userId) {
      return next(new ForbiddenError("작성자 외에는 수정할 수 없습니다."));
    }
    return next();
  }
);

export const verifyCommentAuth: RequestHandler = catchHandler(
  async (req, res, next) => {
    const { id } = create(req.params, IdParamsStruct);
    const userId = req.user.id;
    const comment = await commentRepository.getById(id);

    if (!comment) {
      return next(new NotFoundError("댓글"));
    }

    if (comment.authorId !== userId) {
      return next(new ForbiddenError("작성자 외에는 수정할 수 없습니다."));
    }
    return next();
  }
);
