import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';

export const createNotification = async function (req: Request, res: Response): Promise<void> {
  const notification = await notificationService.createNotification(req.body);
  res.status(200).json(notification);
};

export async function readMyNotification(req: Request, res: Response): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);

  const result = await notificationService.readMyNotificationService(id);
  res.status(200).json(result);
}
