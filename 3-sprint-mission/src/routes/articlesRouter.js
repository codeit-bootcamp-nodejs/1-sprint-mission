import express from "express";
import { withAsync } from "../middleware/withAsync.js";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  postArticlesLike,
  deleteArticlesLike,
} from "../controllers/articlesController.js";
import { verifyAccessToken, verifyAricleAuth } from "../middleware/auth.js";

const articlesRouter = express.Router();

articlesRouter.post("/", verifyAccessToken, withAsync(createArticle));
articlesRouter.post(
  "/likes/:articleId",
  verifyAccessToken,
  withAsync(postArticlesLike)
);
articlesRouter.get("/", withAsync(getArticleList));
articlesRouter.get("/:id", withAsync(getArticle));
articlesRouter.patch(
  "/:id",
  verifyAccessToken,
  verifyAricleAuth,
  withAsync(updateArticle)
);
articlesRouter.delete(
  "/:id",
  verifyAccessToken,
  verifyAricleAuth,
  withAsync(deleteArticle)
);
articlesRouter.delete(
  "/likes/:articleId",
  verifyAccessToken,
  withAsync(deleteArticlesLike)
);
articlesRouter.post(
  "/:id/comments",
  verifyAccessToken,
  withAsync(createComment)
);
articlesRouter.get("/:id/comments", withAsync(getCommentList));

export default articlesRouter;
