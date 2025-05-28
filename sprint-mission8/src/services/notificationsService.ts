import { Notification, NotificationType } from '@prisma/client';
import { Server } from 'socket.io';
import * as notificationRepo from '../repositories/notificationsRepository';
import { sendNotification } from '../socket/socketService';
import { NotificationPayloadMap } from '../types/notification';

export async function createNotification<T extends NotificationType>(
  userId: number,
  type: T,
  payload: NotificationPayloadMap[T],
  io: Server,
): Promise<Notification> {
  const notification = await notificationRepo.createNotification(userId, type, payload);
  sendNotification(io, userId, notification);
  return notification;
}

export const getNotificationsByUser = notificationRepo.findByUser;
export const getUnreadCount = notificationRepo.countUnread;
export const markAsRead = notificationRepo.updateAsRead;
