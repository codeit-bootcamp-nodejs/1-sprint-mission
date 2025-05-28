import { Request, Response } from 'express';
import * as notificationService from '../services/notificationsService';
import { Notification } from '@prisma/client';

interface AuthedRequest extends Request {
  user: { id: number };
}

export const getMyNotifications = async (req: AuthedRequest, res: Response): Promise<void> => {
  const userId = req.user.id;
  const notifications: Notification[] = await notificationService.getNotificationsByUser(userId);
  res.status(200).json(notifications);
};

export const getUnreadNotificationCount = async (
  req: AuthedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user.id;
  const count: number = await notificationService.getUnreadCount(userId);
  res.status(200).json({ count });
};

export const markNotificationAsRead = async (req: AuthedRequest, res: Response): Promise<void> => {
  const notificationId = parseInt(req.params.id, 10);
  const notification: Notification = await notificationService.markAsRead(notificationId);
  res.status(200).json(notification);
};
