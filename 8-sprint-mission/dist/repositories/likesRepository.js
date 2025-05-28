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
exports.createLike = createLike;
exports.getLike = getLike;
exports.deleteLike = deleteLike;
const prismaClient_1 = require("../lib/prismaClient");
function createLike(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdLike = yield prismaClient_1.prismaClient.like.create({
            data,
        });
        return createdLike;
    });
}
function getLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const like = yield prismaClient_1.prismaClient.like.findFirst({
            where: { articleId, userId },
        });
        return like;
    });
}
function deleteLike(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient_1.prismaClient.like.delete({
            where: { id },
        });
    });
}
