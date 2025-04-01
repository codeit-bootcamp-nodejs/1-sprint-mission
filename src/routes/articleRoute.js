import express from "express";
import {
  getArticle,
  createArticle,
  getArticleDetail,
  patchArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { verifyArticleAuth } from "../lib/tokenAuth.js";

const articleRoute = express.Router();

articleRoute.get("/", getArticle);
articleRoute.post("/", createArticle);
articleRoute.get("/:id", getArticleDetail);
articleRoute.patch("/:id", verifyArticleAuth, patchArticle);
articleRoute.delete("/:id", verifyArticleAuth, deleteArticle);

export default articleRoute;
