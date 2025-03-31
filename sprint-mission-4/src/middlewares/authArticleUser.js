import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authArticleUser = async (req, res, next) => {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { userId: true },
  });

  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  if (article.userId !== req.user.id) {
    return res.status(403).json({ message: '수정 또는 삭제 권한이 없습니다.' });
  }

  next();
};

export default authArticleUser;
