import { RequestHandler } from "express";
import {
  getNotificationList,
  getNumUnreadNotifications,
  markAsRead,
} from "../services/notificationService";

export const getNotifications: RequestHandler = async function (
  req,
  res,
  next
) {
  const notifications = await getNotificationList(Number(req.user!.userId));
  return res.json(notifications);
};

export const getUnreadNotificationCount: RequestHandler = async function (
  req,
  res,
  next
) {
  const count = await getNumUnreadNotifications(Number(req.user!.userId));
  return res.json(count);
};
export const markNotificationAsRead: RequestHandler = async function (
  req,
  res,
  next
) {
  const { id } = req.params;
  await markAsRead(Number(req.user!.userId), id);
  return res.status(204).end();
};