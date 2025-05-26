import { create } from 'superstruct';
import { prisma } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { Request, Response } from 'express'

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      images,
      user: {
        connect: { id: req.user!.id },
      },
    },
  });

  res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('product', id);
  }

  return res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== req.user!.id) {
    return res.status(403).json({ message: '수정 권한이 없습니다.' });
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== req.user!.id) {
    return res.status(403).json({ message: '삭제 권한이 없습니다.' });
  }

  await prisma.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      product: { connect: { id: productId } },
      user: { connect: { id: req.user!.id } },
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
