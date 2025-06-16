import { prismaClient } from '../lib/prismaClient'; 
import { CursorPaginationParams } from '../types/pagination';
import { Prisma } from '@prisma/client';
export async function getNotificationsByUserId(userId: number, params: CursorPaginationParams) {
  const { cursor, limit } = params;
  const where = {
    userId,
  };
  const notificationsWithCursor = await prismaClient.notification.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });
  const totalCount = await prismaClient.notification.count({ where });
  const unreadCount = await prismaClient.notification.count({ where: { ...where, isRead: false } });
  const notifications = notificationsWithCursor.slice(0, limit);
  const cursorNotification = notificationsWithCursor[notificationsWithCursor.length - 1];
  const nextCursor = cursorNotification ? cursorNotification.id : null;
  return { notifications, totalCount, unreadCount, nextCursor };
}

export async function createNotification(
  data: Prisma.NotificationCreateInput,
) {
  return await prismaClient.notification.create({ data });
}

export async function createNotifications(
  data: Prisma.NotificationCreateManyInput[],
) {
  return await prismaClient.notification.createMany({ data });
}
export async function getNotificationById(id: number) {
  const notification = await prismaClient.notification.findUnique({
    where: { id },
  });
  return notification;
}

export async function updateNotificationById(
  id: number,
  data: Prisma.NotificationUpdateInput,
) {
  await prismaClient.notification.update({
    where: { id },
    data,
  });
}
export async function updateNotificationsByUserId(userId: number, data: Partial<Notification>) {
  await prismaClient.notification.updateMany({
    where: { userId },
    data,
  });
}
