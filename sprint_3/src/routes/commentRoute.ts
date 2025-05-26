import express from "express";
import {
  creatArticleComment,
  createProductComment,
  deleteComment,
  getProductCommentList,
  getArticleCommentList,
  patchComment,
} from "../controllers/commentController";
import auth from "../lib/jwtAuth";
import { verifyCommentAuth } from "../lib/tokenAuth";
import { catchHandler } from "../lib/catchHandler";

const commentRoute = express.Router();

commentRoute.patch("/:id", verifyCommentAuth, catchHandler(patchComment));
commentRoute.delete("/:id", verifyCommentAuth, catchHandler(deleteComment));
commentRoute.get("/products/:id", catchHandler(getProductCommentList));
commentRoute.post(
  "/products/:id",
  auth.verifyAccessToken,
  catchHandler(createProductComment)
);
commentRoute.get("/articles/:id", catchHandler(getArticleCommentList));
commentRoute.post(
  "/articles/:id",
  auth.verifyAccessToken,
  catchHandler(creatArticleComment)
);

export default commentRoute;
