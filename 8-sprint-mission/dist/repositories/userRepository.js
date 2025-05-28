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
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.findUnique({
            where: {
                id: id,
            },
        });
    });
}
function getByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.findUnique({
            where: {
                email: email,
            },
        });
    });
}
function changePassword(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.update({
            where: {
                id: id,
            },
            data: {
                password: password,
            },
        });
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.delete({
            where: {
                id: id,
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.update({
            where: {
                id: id,
            },
            data: data,
        });
    });
}
function save(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.user.create({
            data: {
                email: user.email,
                nickname: user.nickname,
                password: user.password,
                image: user.image,
            },
        });
    });
}
exports.default = {
    deleteById,
    changePassword,
    update,
    save,
    getByEmail,
    getById,
};
