import express from "express";
import {
  getCommentList,
  postArticleComment,
  postProductComment,
  patchComment,
  deleteComment,
} from "../controllers/commentController";
import { verifyAccessToken, verifyCommentAuthor } from "../middleware/jwtAuth";

const commentRouter = express.Router();
commentRouter.route("/").get(getCommentList);

commentRouter
  .route("/:id")
  .patch(verifyAccessToken, verifyCommentAuthor, patchComment)
  .delete(verifyAccessToken, verifyCommentAuthor, deleteComment);
commentRouter.route("/article/:id").post(verifyAccessToken, postArticleComment);
commentRouter.route("/product/:id").post(verifyAccessToken, postProductComment);

export default commentRouter;
