import { create } from 'superstruct';
import { prisma } from '../lib/prismaClient';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import { Request, Response, } from 'express';
// import { Comment } from '@prisma/client';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prisma.comment.findUnique({ where: { id } }); // Comment | null 안넣어도 빨간줄 안생기네?
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user!.id) {
    return res.status(403).json({ message: '수정 권한이 없습니다.' });
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prisma.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user!.id) {
    return res.status(403).json({ message: '삭제 권한이 없습니다.' });
  }

  await prisma.comment.delete({ where: { id } });

  return res.status(204).send();
}
