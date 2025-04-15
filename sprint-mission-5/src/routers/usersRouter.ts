import { Router } from 'express';
import {
  getMe,
  updateMe,
  updateMyPassword,
  getMyProductList,
  getMyFavoriteList,
} from '../controllers/usersController.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.get('/me', authenticate(), getMe);
router.patch('/me', authenticate(), updateMe);
router.patch('/me/password', authenticate(), updateMyPassword);
router.get('/me/products', authenticate(), getMyProductList);
router.get('/me/favorites', authenticate(), getMyFavoriteList);

export default router;
