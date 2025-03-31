import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authProductUser = async (req, res, next) => {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  if (product.userId !== req.user.id) {
    return res.status(403).json({ message: '수정 또는 삭제 권한이 없습니다.' });
  }

  next();
};

export default authProductUser;
