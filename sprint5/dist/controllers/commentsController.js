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
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const superstruct_1 = require("superstruct");
const prismaClient_1 = require("../lib/prismaClient");
const commentsStruct_1 = require("../structs/commentsStruct");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const commonStructs_1 = require("../structs/commonStructs");
// import { Comment } from '@prisma/client';
function updateComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.UpdateCommentBodyStruct);
        const existingComment = yield prismaClient_1.prisma.comment.findUnique({ where: { id } }); // Comment | null 안넣어도 빨간줄 안생기네?
        if (!existingComment) {
            throw new NotFoundError_1.default('comment', id);
        }
        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }
        const updatedComment = yield prismaClient_1.prisma.comment.update({
            where: { id },
            data: { content },
        });
        return res.send(updatedComment);
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const existingComment = yield prismaClient_1.prisma.comment.findUnique({ where: { id } });
        if (!existingComment) {
            throw new NotFoundError_1.default('comment', id);
        }
        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }
        yield prismaClient_1.prisma.comment.delete({ where: { id } });
        return res.status(204).send();
    });
}
