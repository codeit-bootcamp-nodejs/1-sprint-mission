import { Notification } from "@prisma/client";

export const notificationResponseDTO = (notification: Notification) => {
  return {
    id: notification.id,
    type: notification.type,
    payload: notification.payload,
    read: notification.read,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
};

export const notificationListResponseDTO = (
  notifications: Notification[],
  count: number
) => {
  return {
    notifications: notifications.map(notificationResponseDTO),
    count,
  };
};
