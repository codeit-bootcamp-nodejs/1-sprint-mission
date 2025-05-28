"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationListResponseDTO = exports.notificationResponseDTO = void 0;
const notificationResponseDTO = (notification) => {
    return {
        id: notification.id,
        type: notification.type,
        payload: notification.payload,
        read: notification.read,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
    };
};
exports.notificationResponseDTO = notificationResponseDTO;
const notificationListResponseDTO = (notifications, count) => {
    return {
        notifications: notifications.map(exports.notificationResponseDTO),
        count,
    };
};
exports.notificationListResponseDTO = notificationListResponseDTO;
