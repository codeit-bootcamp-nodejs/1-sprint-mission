import express from "express";
import auth from "../middlewares/auth";
import commentController from "../controllers/commentController";

const router = express.Router();

router
  .route("/:type/:id")
  .get(commentController.getComments)
  .post(auth.verifyAccessToken, commentController.createComment);

router
  .route("/:type/:id/:commentId")
  .patch(
    auth.verifyAccessToken,
    auth.verifyCommentAuth,
    commentController.updateComment
  )
  .delete(
    auth.verifyAccessToken,
    auth.verifyCommentAuth,
    commentController.deleteComment
  );

export default router;
