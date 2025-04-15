var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { CreateProductBodyStruct, GetProductListParamsStruct, UpdateProductBodyStruct, } from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
export const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const data = create(req.body, CreateProductBodyStruct);
    const createdProduct = yield prismaClient.product.create({
        data: Object.assign(Object.assign({}, data), { userId: req.user.id }),
    });
    res.status(201).send(createdProduct);
});
export const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = create(req.params, IdParamsStruct);
    const product = yield prismaClient.product.findUnique({
        where: { id },
        include: { favorites: true },
    });
    if (!product) {
        throw new NotFoundError('product', id);
    }
    const productWithFavorites = Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: req.user
            ? product.favorites.some((favorite) => { var _a; return favorite.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); })
            : undefined });
    res.send(productWithFavorites);
});
export const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id } = create(req.params, IdParamsStruct);
    const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
    const existingProduct = yield prismaClient.product.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new NotFoundError('product', id);
    }
    if (existingProduct.userId !== req.user.id) {
        throw new ForbiddenError('Should be the owner of the product');
    }
    const updatedProduct = yield prismaClient.product.update({
        where: { id },
        data: { name, description, price, tags, images },
    });
    res.send(updatedProduct);
});
export const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id } = create(req.params, IdParamsStruct);
    const existingProduct = yield prismaClient.product.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new NotFoundError('product', id);
    }
    if (existingProduct.userId !== req.user.id) {
        throw new ForbiddenError('Should be the owner of the product');
    }
    yield prismaClient.product.delete({ where: { id } });
    res.status(204).send();
});
export const getProductList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
    const where = keyword
        ? {
            OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
        : undefined;
    const totalCount = yield prismaClient.product.count({ where });
    const products = yield prismaClient.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
        where,
        include: {
            favorites: true,
        },
    });
    const productsWithFavorites = products.map((product) => (Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: req.user
            ? product.favorites.some((favorite) => { var _a; return favorite.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); })
            : undefined })));
    res.send({
        list: productsWithFavorites,
        totalCount,
    });
});
export const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: productId } = create(req.params, IdParamsStruct);
    const { content } = create(req.body, CreateCommentBodyStruct);
    const existingProduct = yield prismaClient.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        throw new NotFoundError('product', productId);
    }
    const createdComment = yield prismaClient.comment.create({
        data: { productId, content, userId: req.user.id },
    });
    res.status(201).send(createdComment);
});
export const getCommentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
    const existingProduct = yield prismaClient.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        throw new NotFoundError('product', productId);
    }
    const commentsWithCursorComment = yield prismaClient.comment.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        where: { productId },
    });
    const comments = commentsWithCursorComment.slice(0, limit);
    const cursorComment = commentsWithCursorComment[comments.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;
    res.send({
        list: comments,
        nextCursor,
    });
});
export const createFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: productId } = create(req.params, IdParamsStruct);
    const existingProduct = yield prismaClient.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        throw new NotFoundError('product', productId);
    }
    const existingFavorite = yield prismaClient.favorite.findFirst({
        where: { productId, userId: req.user.id },
    });
    if (existingFavorite) {
        throw new BadRequestError('Already favorited');
    }
    yield prismaClient.favorite.create({ data: { productId, userId: req.user.id } });
    res.status(201).send();
});
export const deleteFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const { id: productId } = create(req.params, IdParamsStruct);
    const existingFavorite = yield prismaClient.favorite.findFirst({
        where: { productId, userId: req.user.id },
    });
    if (!existingFavorite) {
        throw new BadRequestError('Not favorited');
    }
    yield prismaClient.favorite.delete({ where: { id: existingFavorite.id } });
    res.status(204).send();
});
