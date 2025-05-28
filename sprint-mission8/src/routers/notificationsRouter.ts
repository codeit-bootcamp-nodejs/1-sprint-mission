import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
} from '../services/notificationsService';

const router = express.Router();

router.get(
  '/me/notifications',
  withAsync(authenticate()),
  withAsync(async (req, res) => {
    const userId = req.user.id;
    const notifications = await getNotificationsByUser(userId);
    res.status(200).json(notifications);
  }),
);

router.get(
  '/me/notifications/unread-count',
  withAsync(authenticate()),
  withAsync(async (req, res) => {
    const userId = req.user.id;
    const count = await getUnreadCount(userId);
    res.status(200).json({ count });
  }),
);

router.patch(
  '/notifications/:id/read',
  withAsync(authenticate()),
  withAsync(async (req, res) => {
    const notificationId = parseInt(req.params.id, 10);
    const notification = await markAsRead(notificationId);
    res.status(200).json(notification);
  }),
);

export default router;
