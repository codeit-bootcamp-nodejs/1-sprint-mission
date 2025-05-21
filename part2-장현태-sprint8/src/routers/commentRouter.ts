import express from "express";
import {
  getCommentList,
  postArticleComment,
  postProductComment,
  patchComment,
  deleteComment,
} from "../controllers/commentController";
import { verifyAccessToken, verifyCommentAuthor } from "../middleware/jwtAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const commentRouter = express.Router();
commentRouter.route("/").get(asyncHandler(getCommentList));

commentRouter
  .route("/:id")
  .patch(verifyAccessToken, verifyCommentAuthor, asyncHandler(patchComment))
  .delete(verifyAccessToken, verifyCommentAuthor, asyncHandler(deleteComment));
commentRouter
  .route("/article/:id")
  .post(verifyAccessToken, asyncHandler(postArticleComment));
commentRouter
  .route("/product/:id")
  .post(verifyAccessToken, asyncHandler(postProductComment));

export default commentRouter;
