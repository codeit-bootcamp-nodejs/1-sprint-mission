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
exports.getComment = getComment;
exports.getCommentList = getCommentList;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const prismaClient_1 = require("../lib/prismaClient");
function createComment(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdComment = yield prismaClient_1.prismaClient.comment.create({
            data,
        });
        return createdComment;
    });
}
function getComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield prismaClient_1.prismaClient.comment.findUnique({
            where: { id },
        });
        return comment;
    });
}
function getCommentList(where_1, _a) {
    return __awaiter(this, arguments, void 0, function* (where, { cursor, limit }) {
        const commentsWithCursor = yield prismaClient_1.prismaClient.comment.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: limit + 1,
            where,
            orderBy: { createdAt: "desc" },
        });
        const comments = commentsWithCursor.slice(0, limit);
        const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return {
            list: comments,
            nextCursor,
        };
    });
}
function updateComment(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.comment.update({
            where: { id },
            data,
        });
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.comment.delete({
            where: { id },
        });
    });
}
