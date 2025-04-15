import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  getMyInfo,
  updateMyInfo,
  changePassword,
  getMyProducts,
} from '../controllers/usersController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const usersRouter = express.Router();

usersRouter.get('/me', authMiddleware, withAsync(getMyInfo));
usersRouter.patch('/me', authMiddleware, withAsync(updateMyInfo));
usersRouter.patch('/password', authMiddleware, withAsync(changePassword));
usersRouter.get('/my-products', authMiddleware, withAsync(getMyProducts));

export default usersRouter;
