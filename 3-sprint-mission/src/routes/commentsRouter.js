import express from "express";
import { withAsync } from "../middleware/withAsync.js";
import {
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { verifyAccessToken, verifyCommentAuth } from "../middleware/auth.js";

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
