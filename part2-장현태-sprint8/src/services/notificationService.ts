import notificationRepository from "../repositories/notificationRepository";

export async function createNotification(userId: number, type: string) {
  return await notificationRepository.save(userId, type);
}

export async function getNotificationList(userId: number) {
  return await notificationRepository.getAllbyUserId(userId);
}

export async function getNumUnreadNotifications(userId: number) {
  return await notificationRepository.getCountUnreadNotifications(userId);
}
export async function markAsRead(userId: number, notificationId: string) {
  return await notificationRepository.update(userId, notificationId);
}
