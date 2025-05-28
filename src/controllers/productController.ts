import { Request, Response } from 'express';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import {
  createCommentService,
  createProductService,
  deleteProductService,
  getProductCommentService,
  getProductListService,
  getProductService,
  updateProductService,
} from '../services/productService';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { getById } from '../repositories/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import { createFavoriteService, deleteFavoriteService } from '../services/favoritesService';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const data = create(req.body, CreateProductBodyStruct);

  const product = await createProductService(data, req.user.id);

  res.status(201).json(product);
};

export const getPorduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  const product = await getProductService(id);

  res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const product = await getById(id);

  if (!product) {
    throw new NotFoundError('product not found', id);
  }

  if (product.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  const updatedProduct = await updateProductService(id, {
    id,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: new Date(),
    name,
    description,
    price,
    tags,
    images,
  });

  res.status(200).json(updatedProduct);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);

  const product = await getById(id);

  if (!product) {
    throw new NotFoundError('product not found', id);
  }

  if (product.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  const deleteProduct = await deleteProductService(id);

  res.status(204).json();
};

export const getProductList = async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const getProducts = await getProductListService({ page, pageSize, orderBy, keyword });

  res.status(200).json(getProducts);
};

export const createComment = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const comment = await createCommentService({ productId, content, userId: req.user.id });

  res.status(201).send(comment);
};

export const getCommentList = async (req: Request, res: Response): Promise<void> => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const { comments, nextCursor } = await getProductCommentService({
    productId,
    cursor,
    limit,
  });

  res.status(200).json({ list: comments, nextCursor });
};

export const createFavorite = async (req: Request, res: Response) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const createFavorite = await createFavoriteService(productId, userId);

  res.status(200).json(createFavorite);
};

export const deleteFavorite = async (req: Request, res: Response) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const userId = req.user.id;

  const deleteFavorite = await deleteFavoriteService(productId, userId);

  res.status(200).json(deleteFavorite);
};
