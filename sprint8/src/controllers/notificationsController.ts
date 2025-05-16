import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

export async function readNotification(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const userId = req.user.id; 
  const notification = await NotificationService.readNotification(id, userId);
  res.json(notification);
}
