import express from "express";
import {
  getArticleList,
  postArticle,
  patchArticle,
  deleteArticle,
} from "../api/article.js";
import { postArticleValidation } from "../middleware/requestValidation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(asyncHandler(getArticleList))
  .post(postArticleValidation, asyncHandler(postArticle));

articleRouter
  .route("/:id")
  .patch(asyncHandler(patchArticle))
  .delete(asyncHandler(deleteArticle));

export default articleRouter;
