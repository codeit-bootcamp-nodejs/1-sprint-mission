import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

async function getByType({ type, id, cursor, limit = 10 }) {
  const key = type === "product" ? "productId" : "articleId";

  const query = {
    where: { [key]: id },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  return await prisma.comment.findMany({
    ...query,
    select: { id: true, content: true, createdAt: true },
  });
}

async function save(comment) {
  return await prisma.comment.create({
    data: {
      content: comment.content,
      userId: comment.userId,
      productId: comment.productId,
      articleId: comment.articleId,
    },
  });
}

async function update(id, data) {
  return await prisma.comment.update({
    where: { id },
    data: data,
  });
}

async function remove(id) {
  return await prisma.comment.delete({
    where: { id },
  });
}

export default {
  getById,
  getByType,
  save,
  update,
  remove,
};
