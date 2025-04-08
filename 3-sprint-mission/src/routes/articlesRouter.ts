import express from "express";
import { withAsync } from "../middleware/withAsync";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  postArticleLike,
  deleteArticleLike,
} from "../controllers/articlesController";
import { verifyAccessToken, verifyAricleAuth } from "../middleware/auth";

const articlesRouter = express.Router();

articlesRouter.post("/", verifyAccessToken, withAsync(createArticle));
articlesRouter.post(
  "/likes/:articleId",
  verifyAccessToken,
  withAsync(postArticleLike)
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
  withAsync(deleteArticleLike)
);
articlesRouter.post(
  "/:id/comments",
  verifyAccessToken,
  withAsync(createComment)
);
articlesRouter.get("/:id/comments", withAsync(getCommentList));

export default articlesRouter;
