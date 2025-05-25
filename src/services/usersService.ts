import { Product } from '@prisma/client';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import * as usersRepository from '../repositories/usersRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as notificationsRepository from '../repositories/notificationsRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import User from '../types/User';

type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export async function getUser(userId: number): Promise<User> {
  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new NotFoundError('user', userId);
  }

  return user;
}

export async function updateUser(userId: number, data: Partial<UpdateUserData>): Promise<User> {
  const updatedUser = await usersRepository.updateUser(userId, data);
  return updatedUser;
}

export async function getMyProductList(
  userId: number,
  params: PagePaginationParams,
): Promise<PagePaginationResult<Product>> {
  const result = await productsRepository.getProductListWithFavorites(params, { userId });
  return result;
}

export async function getMyFavoriteList(
  userId: number,
  params: PagePaginationParams,
): Promise<PagePaginationResult<Product>> {
  const result = await productsRepository.getFavoriteProductListByOwnerId(userId, params);
  return result;
}

export async function getMyNotificationList(userId: number) {
  const result = await notificationsRepository.getNotificationsByUserId(userId);
  return result;
}

export async function getMyUnreadNotificationCount(userId: number) {
  const count = await notificationsRepository.countUnreadByUserId(userId);
  return count;
}

export async function updateMyNotificationReadStatus(userId: number, notificationId: number) {
  const notification = await notificationsRepository.getNotificationById(notificationId);
  if (!notification || notification.userId !== userId) {
    throw new NotFoundError('notification', notificationId);
  }

  await notificationsRepository.updateReadStatus(notificationId);
}
