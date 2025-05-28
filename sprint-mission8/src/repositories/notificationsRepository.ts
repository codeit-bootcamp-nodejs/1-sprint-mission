import { prismaClient } from '../lib/prismaClient';
import { Notification, NotificationType, Prisma } from '@prisma/client';
import { NotificationPayloadMap } from '../types/notification';

export function createNotification<T extends NotificationType>(
  userId: number,
  type: T,
  payload: NotificationPayloadMap[T],
): Promise<Notification> {
  return prismaClient.notification.create({
    data: {
      userId,
      type,
      payload: payload as unknown as Prisma.InputJsonValue,
    },
  });
}

export function findByUser(userId: number): Promise<Notification[]> {
  return prismaClient.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function countUnread(userId: number): Promise<number> {
  return prismaClient.notification.count({
    where: { userId, read: false },
  });
}

export function updateAsRead(notificationId: number): Promise<Notification> {
  return prismaClient.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}
