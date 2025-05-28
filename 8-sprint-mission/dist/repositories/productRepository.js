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
function save(userId, product) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                user: {
                    connect: { id: userId },
                },
            },
        });
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getbyId호출됨");
        return yield prismaClient_1.prismaClient.product.findUnique({
            where: {
                id: id,
            },
        });
    });
}
function getUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.product.findMany({
            where: {
                id: userId,
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.product.update({
            where: {
                id: id,
            },
            data: data,
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.product.delete({
            where: {
                id: id,
            },
        });
    });
}
function getProductList(page, pageSize, orderBy, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = keyword
            ? {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            }
            : undefined;
        try {
            const totalCount = yield prismaClient_1.prismaClient.product.count({ where });
            const products = yield prismaClient_1.prismaClient.product.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
                where,
            });
            return { list: products, totalCount };
        }
        catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    });
}
function addLike(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.productLikes.create({
            data: {
                userId,
                productId,
            },
        });
    });
}
function deleteLike(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.productLikes.deleteMany({
            where: {
                userId,
                productId,
            },
        });
    });
}
function userLikeProducts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.product.findMany({
            where: { ProductLikes: { some: { userId } } },
            select: {
                id: true,
                name: true,
                price: true,
            },
        });
    });
}
exports.default = {
    save,
    remove,
    update,
    getById,
    getProductList,
    addLike,
    deleteLike,
    getUserId,
    userLikeProducts,
};
