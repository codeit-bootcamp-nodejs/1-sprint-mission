import express from "express";
import { withAsync } from "../middlewares/withAsync.js";
import {
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import { verifyAccessToken } from "../middlewares/auth/verifyToken.js";
import { verifyComment } from "../middlewares/auth/verifyComment.js";

const commentsRouter = express.Router();

commentsRouter.patch(
  "/:id",
  verifyAccessToken,
  verifyComment,
  withAsync(updateComment)
);
commentsRouter.delete(
  "/:id",
  verifyAccessToken,
  verifyComment,
  withAsync(deleteComment)
);

export default commentsRouter;
