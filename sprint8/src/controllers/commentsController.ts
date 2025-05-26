import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateCommentBodyStruct, CreateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import * as commentsService from '../services/commentsService';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentsService.updateComment(id, req.user.id, content);
  res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentsService.deleteComment(id, req.user.id);
  res.status(204).send();
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content }: { content: string } = create(req.body, CreateCommentBodyStruct);

  const comment = await commentsService.createComment({
    articleId,
    content,
    userId: req.user.id, 
  });

  res.status(201).json(comment);
}