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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = createArticle;
exports.getArticle = getArticle;
exports.getArticleWithLkes = getArticleWithLkes;
exports.getArticleListWithLikes = getArticleListWithLikes;
exports.updateArticleWithLikes = updateArticleWithLikes;
exports.deleteArticle = deleteArticle;
const prismaClient_1 = require("../lib/prismaClient");
function createArticle(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdArticle = yield prismaClient_1.prismaClient.article.create({
            data,
        });
        return createdArticle;
    });
}
function getArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield prismaClient_1.prismaClient.article.findUnique({ where: { id } });
        return article;
    });
}
function getArticleWithLkes(id_1) {
    return __awaiter(this, arguments, void 0, function* (id, { userId } = {}) {
        const article = yield prismaClient_1.prismaClient.article.findUnique({
            where: { id },
            include: {
                likes: true,
            },
        });
        if (!article) {
            return null;
        }
        return Object.assign(Object.assign({}, article), { likes: undefined, likeCount: article.likes.length, isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined });
    });
}
function getArticleListWithLikes(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page, pageSize, orderBy, keyword }, { userId, } = {}) {
        const where = {
            title: keyword ? { contains: keyword } : undefined,
        };
        const totalCount = yield prismaClient_1.prismaClient.article.count({ where });
        const articles = yield prismaClient_1.prismaClient.article.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
            where,
            include: {
                likes: true,
            },
        });
        const mappedArticles = articles.map((article) => (Object.assign(Object.assign({}, article), { likes: undefined, likeCount: article.likes.length, isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined })));
        return {
            list: mappedArticles,
            totalCount,
        };
    });
}
function updateArticleWithLikes(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedArticle = yield prismaClient_1.prismaClient.article.update({
            where: { id },
            data,
            include: {
                likes: true,
            },
        });
        return Object.assign(Object.assign({}, updatedArticle), { likeCount: updatedArticle.likes.length, isLiked: data.userId
                ? updatedArticle.likes.some((like) => like.userId === data.userId)
                : undefined });
    });
}
function deleteArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.article.delete({
            where: { id },
        });
    });
}
