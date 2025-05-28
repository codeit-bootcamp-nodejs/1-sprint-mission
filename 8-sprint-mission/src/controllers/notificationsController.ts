import {
  notificationResponseDTO,
  notificationListResponseDTO,
} from "../dto/notificationsDTO";
import * as notificationsService from "../services/notificationsService";
import { Request, Response, NextFunction } from "express";

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user.id;
  const { notifications, count } =
    await notificationsService.getUserNotifications(userId);
  res.status(200).send(notificationListResponseDTO(notifications, count));
}

export async function patchReadStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = Number(req.params.notificationId);
  const notification = await notificationsService.patchRead(id);
  res.status(200).json(notificationResponseDTO(notification));
}
