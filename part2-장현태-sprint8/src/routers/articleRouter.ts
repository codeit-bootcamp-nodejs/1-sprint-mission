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

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(getArticleList)
  .post(verifyAccessToken, postArticle);

articleRouter
  .route("/:id")
  .get(verifyAccessToken, getArticle)
  .patch(verifyAccessToken, verifyArticleAuthor, patchArticle)
  .delete(verifyAccessToken, verifyArticleAuthor, deleteArticle);

articleRouter
  .route("/:id/like")
  .post(verifyAccessToken, postArticleLike)
  .delete(verifyAccessToken, deleteArticleLike);
export default articleRouter;
