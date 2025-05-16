import { RequestHandler } from "express";
import {
  getNotificationList,
  getNumUnreadNotifications,
  markAsRead,
} from "../services/notification";

export const getNotifications: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const notifications = await getNotificationList(Number(req.user!.userId));
    return res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationCount: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const count = await getNumUnreadNotifications(Number(req.user!.userId));
    return res.json(count);
  } catch (error) {
    next(error);
  }
};
export const markNotificationAsRead: RequestHandler = async function (
  req,
  res,
  next
) {
  try {
    const { id } = req.params;
    await markAsRead(Number(req.user!.userId), id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
