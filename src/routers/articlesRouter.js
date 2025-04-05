import express from "express";
import { withAsync } from "../middlewares/withAsync.js";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from "../controllers/articlesController.js";
import { verifyAccessToken } from "../middlewares/auth/verifyToken.js";
import { verifyArticle } from "../middlewares/auth/verifyArticle.js";

const articlesRouter = express.Router();

articlesRouter.post("/", verifyAccessToken, withAsync(createArticle));
articlesRouter.get("/", withAsync(getArticleList));
articlesRouter.get("/:id", withAsync(getArticle));
articlesRouter.patch(
  "/:id",
  verifyAccessToken,
  verifyArticle,
  withAsync(updateArticle)
);
articlesRouter.delete(
  "/:id",
  verifyAccessToken,
  verifyArticle,
  withAsync(deleteArticle)
);
articlesRouter.post(
  "/:id/comments",
  verifyAccessToken,
  withAsync(createComment)
);
articlesRouter.get("/:id/comments", withAsync(getCommentList));

export default articlesRouter;
