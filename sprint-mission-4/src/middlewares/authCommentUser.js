import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authCommentUser = async (req, res, next) => {
  const commentId = parseInt(req.params.id, 10);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) {
    return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ message: '수정 또는 삭제 권한이 없습니다.' });
  }

  next();
};

export default authCommentUser;
