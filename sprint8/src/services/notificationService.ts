import { NotificationType, Notification } from '@prisma/client';
import { SocketService } from '../lib/socketService';
import { prismaClient } from '../lib/prismaClient';

export class NotificationService {
  static async createNotification(
    userId: number,
    type: NotificationType,
    payload: object
  ): Promise<Notification> {
    const notification = await prismaClient.notification.create({
      data: {
        userId,
        type,
        payload,
      },
    });

    const socketService = SocketService.getInstance();
    socketService.sendNotification(userId, notification);

    return notification;
  }
}
