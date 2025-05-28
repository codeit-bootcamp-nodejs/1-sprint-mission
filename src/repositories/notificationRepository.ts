import { Prisma } from '@prisma/client';
import { NotificationDTO } from '../DTO/notificationDTO';
import { prismaClient } from '../lib/prismaClient';

export async function createNotification(
  data: Omit<NotificationDTO, 'id' | 'createdAt' | 'updatedAt'>,
) {
  return await prismaClient.notification.create({
    data,
  });
}

export async function unreadNotificationCount(userId: number): Promise<number> {
  return prismaClient.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}

export async function readMyNotification(id: number) {
  return prismaClient.notification.update({
    where: { id },
    data: {
      read: true,
    },
  });
}
