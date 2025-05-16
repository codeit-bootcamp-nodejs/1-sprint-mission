import express from 'express';
import { readNotification } from '../controllers/notificationsController';
import { withAsync } from '../lib/withAsync';

const notificationsRouter = express.Router();

notificationsRouter.patch('/:id/read', withAsync(readNotification));

export default notificationsRouter;