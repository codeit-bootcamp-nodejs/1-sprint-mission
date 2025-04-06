import prisma from "../config/prisma";
import { Comment, Prisma } from "@prisma/client";

async function getById(id: string): Promise<Comment | null> {
  return prisma.comment.findUnique({
    where: { id },
  });
}

type GetByTypeParams = {
  type: "product" | "article",
  id: string,
  cursor?: string,
  limit?: number | string,
};

async function getByType({
  type,
  id,
  cursor,
  limit = 10,
}: GetByTypeParams): Promise<Partial<Comment>[]> {
  const key: "productId" | "articleId" =
    type === "product" ? "productId" : "articleId";

  const query: Prisma.CommentFindManyArgs = {
    where: { [key]: id },
    orderBy: { createdAt: "desc" },
    take: typeof limit === "string" ? parseInt(limit) : limit,
    select: { id: true, content: true, createdAt: true },
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  return prisma.comment.findMany(query);
}

type SaveCommentParams = {
  content: string,
  userId: string,
  productId?: string,
  articleId?: string,
};

async function save(comment: SaveCommentParams): Promise<Comment> {
  return prisma.comment.create({
    data: {
      content: comment.content,
      userId: comment.userId,
      productId: comment.productId,
      articleId: comment.articleId,
    },
  });
}

async function update(id: string, data: Partial<Comment>): Promise<Comment> {
  return prisma.comment.update({
    where: { id },
    data,
  });
}

async function remove(id: string): Promise<Comment> {
  return prisma.comment.delete({
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
