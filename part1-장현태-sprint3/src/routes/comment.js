import express from "express";
import {
  patchComment,
  deleteComment,
  postCommentForArticle,
  postCommentForProduct,
  getAritcleCommentList,
  getProductCommentList,
} from "../api/comment.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const commentRouter = express.Router();

commentRouter
  .route("/:id")
  .patch(asyncHandler(patchComment))
  .delete(asyncHandler(deleteComment));
commentRouter.route("/article").get(asyncHandler(getAritcleCommentList));
commentRouter.route("/product").get(asyncHandler(getProductCommentList));
commentRouter
  .route("/article/:id")
  .get(asyncHandler(getAritcleCommentList))
  .post(asyncHandler(postCommentForArticle));
commentRouter
  .route("/product/:id")
  .get(asyncHandler(getAritcleCommentList))
  .post(asyncHandler(postCommentForProduct));
export default commentRouter;
