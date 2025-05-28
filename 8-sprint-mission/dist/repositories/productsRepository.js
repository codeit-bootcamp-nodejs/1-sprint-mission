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
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.getProductWithFavorites = getProductWithFavorites;
exports.getProductListWithFavorites = getProductListWithFavorites;
exports.getFavoriteProductListByOwnerId = getFavoriteProductListByOwnerId;
exports.updateProductWithFavorites = updateProductWithFavorites;
exports.deleteProduct = deleteProduct;
const prismaClient_1 = require("../lib/prismaClient");
function createProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.product.create({
            data,
        });
    });
}
function getProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prismaClient_1.prismaClient.product.findUnique({
            where: { id },
        });
        return product;
    });
}
function getProductWithFavorites(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prismaClient_1.prismaClient.product.findUnique({
            where: { id },
            include: { favorites: true },
        });
        if (!product) {
            return null;
        }
        const mappedProduct = Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: userId
                ? product.favorites.some((favorite) => favorite.userId === userId)
                : undefined });
        return mappedProduct;
    });
}
function getProductListWithFavorites(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page, pageSize, orderBy, keyword }, { userId, } = {}) {
        const where = keyword
            ? {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            }
            : {};
        const totalCount = yield prismaClient_1.prismaClient.product.count({
            where,
        });
        const products = yield prismaClient_1.prismaClient.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
            where,
            include: {
                favorites: true,
            },
        });
        const mappedProducts = products.map((product) => (Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: userId !== undefined
                ? product.favorites.some((favorite) => favorite.userId === userId)
                : undefined })));
        return {
            list: mappedProducts,
            totalCount,
        };
    });
}
function getFavoriteProductListByOwnerId(ownerId_1, _a) {
    return __awaiter(this, arguments, void 0, function* (ownerId, { page, pageSize, orderBy, keyword }) {
        const where = keyword
            ? {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            }
            : {};
        const totalCount = yield prismaClient_1.prismaClient.product.count({
            where: Object.assign(Object.assign({}, where), { favorites: {
                    some: {
                        userId: ownerId,
                    },
                } }),
        });
        const products = yield prismaClient_1.prismaClient.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
            where: Object.assign(Object.assign({}, where), { favorites: {
                    some: {
                        userId: ownerId,
                    },
                } }),
            include: {
                favorites: true,
            },
        });
        const mappedProducts = products.map((product) => (Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: true })));
        return {
            list: mappedProducts,
            totalCount,
        };
    });
}
function updateProductWithFavorites(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prismaClient_1.prismaClient.product.update({
            where: { id },
            data,
            include: {
                favorites: true,
            },
        });
        const mappedProduct = Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: data.userId
                ? product.favorites.some((favorite) => favorite.userId === data.userId)
                : undefined });
        return mappedProduct;
    });
}
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prismaClient.product.delete({
            where: { id },
        });
    });
}
