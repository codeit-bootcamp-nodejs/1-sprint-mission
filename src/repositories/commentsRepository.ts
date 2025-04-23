import { prismaClient } from '../lib/prismaClient';
import { CreateCommentInput } from '../typings/commentTypes';
import { Comment } from '@prisma/client';
import { NotFoundError } from '../lib/errors/NotFoundError';

export async function getById(id: number): Promise<Comment | null> {
  return await prismaClient.comment.findUnique({ where: { id } });
}

export async function getByIdOrThrow(id: number): Promise<Comment> {
  const comment = await prismaClient.comment.findUnique({ where: { id } });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${id} not found`);
  }
  return comment;
}

export async function create(input: CreateCommentInput): Promise<Comment> {
  const cleanData = {
    content: input.content,
    authorId: input.authorId,
    articleId: input.articleId ?? null,
    productId: input.productId ?? null,
  };

  return await prismaClient.comment.create({ data: cleanData });
}

export async function getCommentsForArticle(
  articleId: number,
  limit: number = 10,
  cursor?: number,
): Promise<Comment[]> {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCommentsForProduct(
  productId: number,
  limit: number = 10,
  cursor?: number,
): Promise<Comment[]> {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function update(id: number, content?: string): Promise<Comment> {
  return await prismaClient.comment.update({ where: { id }, data: { content } });
}

export async function deleteById(id: number): Promise<Comment> {
  return await prismaClient.comment.delete({ where: { id } });
}
