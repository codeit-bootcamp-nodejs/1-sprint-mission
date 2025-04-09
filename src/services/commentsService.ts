import { UpdateCommentDTO } from '../DTO/commentDTO';
import NotFoundError from '../lib/errors/NotFoundError';
import { deleteComment, getByCommentId, updateComment } from '../repositories/commentRepository';

export async function updateCommentService(
  id: number,
  data: UpdateCommentDTO,
): Promise<UpdateCommentDTO> {
  const existingComment = await getByCommentId(id);

  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  return await updateComment(id, data);
}

export async function deleteCommentService(id: number): Promise<void> {
  const existingComment = await getByCommentId(id);
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  await deleteComment(id);
}
