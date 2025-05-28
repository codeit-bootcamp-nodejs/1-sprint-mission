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
exports.createUser = createUser;
exports.getUser = getUser;
exports.getUserByEmail = getUserByEmail;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prismaClient_1 = require("../lib/prismaClient");
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdUser = yield prismaClient_1.prismaClient.user.create({
            data,
        });
        return createdUser;
    });
}
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prismaClient_1.prismaClient.user.findUnique({
            where: { id },
        });
        return user;
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prismaClient_1.prismaClient.user.findUnique({
            where: { email },
        });
        return user;
    });
}
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedUser = yield prismaClient_1.prismaClient.user.update({
            where: { id },
            data,
        });
        return updatedUser;
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient_1.prismaClient.user.delete({
            where: { id },
        });
    });
}
