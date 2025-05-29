import express from "express";
import {
  getArticleList,
  getArticle,
  postArticle,
  patchArticle,
  deleteArticle,
  postArticleLike,
  deleteArticleLike,
} from "../controllers/articleController";
import { verifyAccessToken, verifyArticleAuthor } from "../middleware/jwtAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(asyncHandler(getArticleList))
  .post(verifyAccessToken, asyncHandler(postArticle));

articleRouter
  .route("/:id")
  .get(asyncHandler(getArticle))
  .patch(verifyAccessToken, verifyArticleAuthor, asyncHandler(patchArticle))
  .delete(verifyAccessToken, verifyArticleAuthor, asyncHandler(deleteArticle));

articleRouter
  .route("/:id/like")
  .post(verifyAccessToken, asyncHandler(postArticleLike))
  .delete(verifyAccessToken, asyncHandler(deleteArticleLike));
export default articleRouter;
