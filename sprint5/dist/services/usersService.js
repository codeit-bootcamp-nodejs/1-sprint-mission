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
exports.getMyProductsService = exports.updateMyPasswordService = exports.updateMyInfoService = void 0;
const prismaClient_1 = require("../lib/prismaClient");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateMyInfoService = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield prismaClient_1.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updated;
});
exports.updateMyInfoService = updateMyInfoService;
const updateMyPasswordService = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }
    const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }
    const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
    yield prismaClient_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    });
});
exports.updateMyPasswordService = updateMyPasswordService;
const getMyProductsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prismaClient_1.prisma.product.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            images: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
        },
    });
    return products;
});
exports.getMyProductsService = getMyProductsService;
