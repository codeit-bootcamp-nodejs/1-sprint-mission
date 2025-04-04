"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductList = getProductList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
const productsStruct_1 = require("../structs/productsStruct");
const commentsStruct_1 = require("../structs/commentsStruct");
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, price, tags, images } = (0, superstruct_1.create)(req.body, productsStruct_1.CreateProductBodyStruct);
        const product = yield prismaClient_1.prisma.product.create({
            data: {
                name,
                description,
                price,
                tags,
                images,
                user: {
                    connect: { id: req.user.id },
                },
            },
        });
        res.status(201).send(product);
    });
}
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const product = yield prismaClient_1.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundError_1.default('product', id);
        }
        return res.send(product);
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { name, description, price, tags, images } = (0, superstruct_1.create)(req.body, productsStruct_1.UpdateProductBodyStruct);
        const existingProduct = yield prismaClient_1.prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', id);
        }
        if (existingProduct.userId !== req.user.id) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }
        const updatedProduct = yield prismaClient_1.prisma.product.update({
            where: { id },
            data: { name, description, price, tags, images },
        });
        return res.send(updatedProduct);
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const existingProduct = yield prismaClient_1.prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', id);
        }
        if (existingProduct.userId !== req.user.id) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }
        yield prismaClient_1.prisma.product.delete({ where: { id } });
        return res.status(204).send();
    });
}
function getProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, productsStruct_1.GetProductListParamsStruct);
        const where = keyword
            ? {
                OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
            }
            : undefined;
        const totalCount = yield prismaClient_1.prisma.product.count({ where });
        const products = yield prismaClient_1.prisma.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where,
        });
        return res.send({
            list: products,
            totalCount,
        });
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const existingProduct = yield prismaClient_1.prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', productId);
        }
        const comment = yield prismaClient_1.prisma.comment.create({
            data: {
                content,
                product: { connect: { id: productId } },
                user: { connect: { id: req.user.id } },
            },
        });
        return res.status(201).send(comment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const existingProduct = yield prismaClient_1.prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct) {
            throw new NotFoundError_1.default('product', productId);
        }
        const commentsWithCursorComment = yield prismaClient_1.prisma.comment.findMany({
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
    });
}
