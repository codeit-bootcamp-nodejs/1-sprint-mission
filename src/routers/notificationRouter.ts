import express from 'express';
import { withAsync } from '../lib/withAsync';
import { authenticate } from '../middlewares/authenticate';
import { readMyNotification } from '../controllers/notificationControler';

const notificationRouter = express.Router();

notificationRouter.patch('/:id/read', authenticate(), withAsync(readMyNotification));

export default notificationRouter;
