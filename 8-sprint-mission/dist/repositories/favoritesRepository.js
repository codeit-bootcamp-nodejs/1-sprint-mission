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
exports.createFavorite = createFavorite;
exports.getFavorite = getFavorite;
exports.deleteFavorite = deleteFavorite;
exports.getLikedUsers = getLikedUsers;
const prismaClient_1 = require("../lib/prismaClient");
function createFavorite(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdFavorite = yield prismaClient_1.prismaClient.favorite.create({
            data,
        });
        return createdFavorite;
    });
}
function getFavorite(productId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const favorite = yield prismaClient_1.prismaClient.favorite.findFirst({
            where: { productId, userId },
        });
        return favorite;
    });
}
function deleteFavorite(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient_1.prismaClient.favorite.delete({
            where: { id },
        });
    });
}
function getLikedUsers(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.favorite.findMany({
            where: {
                productId,
            },
            select: {
                userId: true,
            },
        });
    });
}
