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
exports.createNotification = createNotification;
exports.getNotifications = getNotifications;
exports.getCount = getCount;
exports.patchReadStatus = patchReadStatus;
const prismaClient_1 = require("../lib/prismaClient");
function createNotification(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prismaClient.notification.create({
            data: Object.assign(Object.assign({}, data), { read: false, payload: data.payload }),
        });
    });
}
function getNotifications(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const notifications = yield prismaClient_1.prismaClient.notification.findMany({
            where: { userId },
        });
        return notifications;
    });
}
function getCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield prismaClient_1.prismaClient.notification.count({
            where: { userId },
        });
        return count;
    });
}
function patchReadStatus(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const notification = yield prismaClient_1.prismaClient.notification.update({
            where: { id },
            data: {
                read: true,
            },
        });
        return notification;
    });
}
