import { NotificationDTO } from '../DTO/notificationDTO';
import NotFoundError from '../lib/errors/NotFoundError';
import * as notificationRepository from '../repositories/notificationRepository';
import { getByUserId } from '../repositories/userRepository';

export const createNotification = async function (
  data: Omit<NotificationDTO, 'id' | 'read' | 'createdAt' | 'updatedAt'>,
) {
  const exsistingUser = await getByUserId(data.userId);
  if (!exsistingUser) {
    throw new NotFoundError('User', data.userId);
  }

  const notification = await notificationRepository.createNotification({
    ...data,
    read: false,
  });

  return notification;
};

export async function readMyNotificationService(id: number): Promise<NotificationDTO> {
  const updatedData = await notificationRepository.readMyNotification(id);

  const result: NotificationDTO = {
    id: updatedData.id,
    userId: updatedData.userId,
    type: updatedData.type,
    payload: (updatedData.payload ?? {}) as object,
    read: true,
    createdAt: updatedData.createdAt,
    updatedAt: updatedData.updatedAt,
  };

  return result;
}
