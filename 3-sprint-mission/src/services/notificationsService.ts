import * as notificationRepository from "../repositories/notificationsRepository";
import { Notification } from "@prisma/client";

export async function getUserNotifications(
  userId: number
): Promise<{ notifications: Notification[]; count: number }> {
  const [notifications, count] = await Promise.all([
    notificationRepository.getNotifications(userId),
    notificationRepository.getCount(userId),
  ]);
  return { notifications, count };
}

export async function patchRead(id: number): Promise<Notification> {
  const notification = await notificationRepository.patchReadStatus(id);
  return notification;
}
