import { Request, Response } from "express";
import commentService from "../services/commentService";
import { NextFunction } from "connect";

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;

    const updateComment = await commentService.updateComment(id, content);
    return res.status(201).send(updateComment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);

    await commentService.deleteComment(id);

    return res.status(204).send({ message: "deleted" });
  } catch (error) {
    next(error);
  }
}
