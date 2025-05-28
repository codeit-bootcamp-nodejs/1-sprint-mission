import { prismaClient } from "../lib/prismaClient";
import { Notification, Prisma } from "@prisma/client";

type createNotificationData = Omit<
  Notification,
  "id" | "read" | "createdAt" | "updatedAt"
>;

export async function createNotification(
  data: createNotificationData
): Promise<Notification> {
  return await prismaClient.notification.create({
    data: {
      ...data,
      read: false,
      payload: data.payload as Prisma.InputJsonValue,
    },
  });
}

export async function getNotifications(
  userId: number
): Promise<Notification[]> {
  const notifications = await prismaClient.notification.findMany({
    where: { userId },
  });
  return notifications;
}

export async function getCount(userId: number): Promise<number> {
  const count = await prismaClient.notification.count({
    where: { userId },
  });
  return count;
}

export async function patchReadStatus(id: number): Promise<Notification> {
  const notification = await prismaClient.notification.update({
    where: { id },
    data: {
      read: true,
    },
  });
  return notification;
}
