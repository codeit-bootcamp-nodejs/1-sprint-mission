import express from 'express';
import { withAsync } from '../lib/withAsync';
import { getMyInfo, updateMyInfo } from '../controllers/usersController';
import { authenticate } from '../middlewares/auth';
import { updateMyPassword } from '../controllers/usersController';
import { getMyProducts } from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate, withAsync(getMyInfo));
usersRouter.patch('/me', authenticate, withAsync(updateMyInfo));
usersRouter.patch('/me/password', authenticate, withAsync(updateMyPassword));
usersRouter.get('/me/products', authenticate, withAsync(getMyProducts));

export default usersRouter;
