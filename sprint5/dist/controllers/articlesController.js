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
exports.createArticle = createArticle;
exports.getArticle = getArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticleList = getArticleList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
const articlesStructs_1 = require("../structs/articlesStructs");
const commentsStruct_1 = require("../structs/commentsStruct");
function createArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.CreateArticleBodyStruct);
        const { title, content, image } = data;
        const article = yield prismaClient_1.prisma.article.create({
            data: {
                title,
                content,
                image,
                user: {
                    connect: { id: req.user.id },
                },
            },
        });
        return res.status(201).send(article);
    });
}
function getArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const article = yield prismaClient_1.prisma.article.findUnique({ where: { id } });
        if (!article) {
            throw new NotFoundError_1.default('article', id);
        }
        return res.send(article);
    });
}
function updateArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.UpdateArticleBodyStruct);
        const article = yield prismaClient_1.prisma.article.update({ where: { id }, data });
        if (!article) {
            throw new NotFoundError_1.default('article', id);
        }
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }
        const updated = yield prismaClient_1.prisma.article.update({ where: { id }, data });
        return res.send(article);
    });
}
function deleteArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const article = yield prismaClient_1.prisma.article.findUnique({ where: { id } });
        if (!article) {
            throw new NotFoundError_1.default('article', id);
        }
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }
        yield prismaClient_1.prisma.article.delete({ where: { id } });
        return res.status(204).send();
    });
}
function getArticleList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, articlesStructs_1.GetArticleListParamsStruct);
        const where = {
            title: keyword ? { contains: keyword } : undefined,
        };
        const totalCount = yield prismaClient_1.prisma.article.count({ where });
        const articles = yield prismaClient_1.prisma.article.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
            where,
        });
        return res.send({
            list: articles,
            totalCount,
        });
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const existingArticle = yield prismaClient_1.prisma.article.findUnique({ where: { id: articleId } });
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', articleId);
        }
        const comment = yield prismaClient_1.prisma.comment.create({
            data: {
                article: { connect: { id: articleId } },
                content,
                user: { connect: { id: req.user.id } },
            },
        });
        return res.status(201).send(comment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const article = yield prismaClient_1.prisma.article.findUnique({ where: { id: articleId } });
        if (!article) {
            throw new NotFoundError_1.default('article', articleId);
        }
        const commentsWithCursor = yield prismaClient_1.prisma.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit + 1,
            where: { articleId },
            orderBy: { createdAt: 'desc' },
        });
        const comments = commentsWithCursor.slice(0, limit);
        const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return res.send({
            list: comments,
            nextCursor,
        });
    });
}
