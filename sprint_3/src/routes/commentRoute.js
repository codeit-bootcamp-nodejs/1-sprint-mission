import express from "express";
import {
  creatArticleComment,
  createProductComment,
  deleteComment,
  getArticleCommentDetail,
  getProductCommentDetatil,
  patchComment,
} from "../controllers/commentController.js";
import { verifycommentAuth } from "../lib/tokenAuth.js";

const commentRoute = express.Router();

commentRoute.patch("/:id", verifycommentAuth, patchComment);
commentRoute.delete("/:id", verifycommentAuth, deleteComment);
commentRoute.get("/products/:id", getProductCommentDetatil);
commentRoute.post("/products/:id", createProductComment);
commentRoute.get("/articles/:id", getArticleCommentDetail);
commentRoute.post("/articles/:id", creatArticleComment);

export default commentRoute;
