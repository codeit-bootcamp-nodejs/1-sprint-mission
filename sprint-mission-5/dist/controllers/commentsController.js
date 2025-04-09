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
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
export function updateComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { id } = create(req.params, IdParamsStruct);
        const { content } = create(req.body, UpdateCommentBodyStruct);
        const existingComment = yield prismaClient.comment.findUnique({ where: { id } });
        if (!existingComment) {
            throw new NotFoundError('comment', id);
        }
        if (existingComment.userId !== req.user.id) {
            throw new ForbiddenError('Should be the owner of the comment');
        }
        const updatedComment = yield prismaClient.comment.update({
            where: { id },
            data: { content },
        });
        res.send(updatedComment);
    });
}
export function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { id } = create(req.params, IdParamsStruct);
        const existingComment = yield prismaClient.comment.findUnique({ where: { id } });
        if (!existingComment) {
            throw new NotFoundError('comment', id);
        }
        if (existingComment.userId !== req.user.id) {
            throw new ForbiddenError('Should be the owner of the comment');
        }
        yield prismaClient.comment.delete({ where: { id } });
        res.status(204).send();
    });
}
