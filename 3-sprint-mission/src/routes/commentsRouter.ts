import express from "express";
import { withAsync } from "../middleware/withAsync";
import {
  updateComment,
  deleteComment,
} from "../controllers/commentsController";
import { verifyAccessToken, verifyCommentAuth } from "../middleware/auth";

const commentsRouter = express.Router();

commentsRouter.patch(
  "/:id",
  verifyAccessToken,
  verifyCommentAuth,
  withAsync(updateComment)
);
commentsRouter.delete(
  "/:id",
  verifyAccessToken,
  verifyCommentAuth,
  withAsync(deleteComment)
);

export default commentsRouter;
