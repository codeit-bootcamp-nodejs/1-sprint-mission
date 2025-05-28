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
const prismaClient_1 = require("../lib/prismaClient");
function save(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.article.create({
            data,
        });
    });
}
function getArticleById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.article.findUnique({
            where: { id },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.article.update({
            where: { id },
            data,
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.article.delete({
            where: { id },
        });
    });
}
function getArticleList(where, skip, take, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalCount = yield prismaClient_1.prismaClient.article.count({
            where,
        });
        const articles = yield prismaClient_1.prismaClient.article.findMany({
            where,
            skip,
            take,
            orderBy,
        });
        return { list: articles, totalCount };
    });
}
function createComment(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.comment.create({
            data,
        });
    });
}
function getCommentList(articleId, page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const comments = yield prismaClient_1.prismaClient.comment.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: { articleId },
            orderBy: { createdAt: "desc" },
        });
        return { list: comments };
    });
}
function addLike(userId, articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.articleLikes.create({
            data: { userId, articleId },
        });
    });
}
function removeLike(userId, articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.articleLikes.deleteMany({
            where: { userId, articleId },
        });
    });
}
function getArticleLikeCount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.article.findUnique({
            where: { id },
        });
    });
}
exports.default = {
    removeLike,
    getArticleLikeCount,
    addLike,
    getCommentList,
    createComment,
    getArticleList,
    remove,
    update,
    getArticleById,
    save,
};
