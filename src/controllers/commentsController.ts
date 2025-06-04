import { Request, Response } from 'express';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { deleteCommentService, updateCommentService } from '../services/commentsService';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { getByCommentId } from '../repositories/commentRepository';
import NotFoundError from '../lib/errors/NotFoundError';

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const comment = await getByCommentId(id);

  if (!comment) {
    throw new NotFoundError('Comment', id);
  }

  if (comment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  const updatedComment = await updateCommentService(id, { content });

  res.status(200).json(updatedComment);
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const comment = await getByCommentId(id);

  if (!comment) {
    throw new NotFoundError('Comment', id);
  }

  if (comment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  const deleteComment = await deleteCommentService(id);

  res.status(204).json(deleteComment);
};
