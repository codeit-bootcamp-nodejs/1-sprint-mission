import { Notification } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

type CreateNotificationParams = {
  userId: number;
  type: string;
  content: string;
  productId?: number;
  articleId?: number;
};

export async function getNotificationsByUserId(userId: number) {
  const notifications = await prismaClient.notification.findMany({
    where: { userId },
  });
  return notifications;
}

export async function getNotificationById(notificationId: number) {
  const notification = await prismaClient.notification.findUnique({
    where: { id: notificationId },
  });
  return notification;
}

export async function countUnreadByUserId(userId: number): Promise<number> {
  const count = await prismaClient.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
  return count;
}

export async function updateReadStatus(notificationId: number) {
  await prismaClient.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
}

export async function createNotification({
  userId,
  type,
  content,
  productId,
  articleId,
}: CreateNotificationParams) {
  const notification = await prismaClient.notification.create({
    data: {
      userId,
      type,
      content,
      productId: productId ?? null,
      articleId: articleId ?? null,
    },
  });
  return notification;
}
