import { Request, Response } from "express";
import commentService from "../services/commentService";
import asyncHandler from "../utils/asyncHandler";
import { CommentType } from "../services/commentService";

interface AuthedRequest extends Request {
  user: {
    id: string;
    userId: string;
  };
}

const getComments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { type, id } = req.params;
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const comments = await commentService.getCommentsByType({
      type: type as CommentType,
      id,
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    res.status(200).send(comments);
  }
);

const createComment = asyncHandler(
  async (req: AuthedRequest, res: Response): Promise<void> => {
    const { type, id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const createdComment = await commentService.createComment({
      type: type as CommentType,
      id,
      content,
      userId,
    });

    res.status(200).send(createdComment);
  }
);

const updateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;
    const { commentId } = req.params;

    const updatedComment = await commentService.updateComment(
      commentId,
      content
    );

    res.status(200).send(updatedComment);
  }
);

const deleteComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    await commentService.deleteComment(commentId);

    res.status(200).send({ message: "Comment deleted successfully" });
  }
);

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
