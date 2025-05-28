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
exports.createComment = createComment;
const prismaClient_1 = require("../lib/prismaClient");
function getCommentById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.comment.findUnique({ where: { id } });
    });
}
function updateComment(id, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.comment.update({
            where: { id },
            data: { content },
        });
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.comment.delete({ where: { id } });
    });
}
function createComment(productId, content, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.comment.create({
            data: { productId, content, userId },
        });
    });
}
function getComments(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.comment.findMany({
            where: {
                productId,
            },
        });
    });
}
exports.default = {
    getCommentById,
    updateComment,
    deleteComment,
    createComment,
    getComments,
};
