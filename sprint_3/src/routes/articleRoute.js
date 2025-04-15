import express from "express";
import {
  getArticle,
  createArticle,
  getArticleDetail,
  patchArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { verifyArticleAuth } from "../lib/tokenAuth.js";
import { catchHandler } from "../lib/catchHandler.js";
import auth from "../lib/jwtAuth.js";
const articleRoute = express.Router();

articleRoute.get("/", catchHandler(getArticle));
articleRoute.get("/user", auth.verifyAccessToken, catchHandler(getArticle));
articleRoute.post("/", auth.verifyAccessToken, catchHandler(createArticle));
articleRoute.get("/:id", catchHandler(getArticleDetail));
articleRoute.patch(
  "/:id",
  auth.verifyAccessToken,
  verifyArticleAuth,
  catchHandler(patchArticle)
);
articleRoute.delete(
  "/:id",
  auth.verifyAccessToken,
  verifyArticleAuth,
  catchHandler(deleteArticle)
);

export default articleRoute;
