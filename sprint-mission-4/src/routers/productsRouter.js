import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import authProductUser from '../middlewares/authProductUser.js';

const productsRouter = express.Router();

productsRouter.patch('/:id', authMiddleware, withAsync(authProductUser), withAsync(updateProduct));

productsRouter.delete('/:id', authMiddleware, withAsync(authProductUser), withAsync(deleteProduct));

//인증
productsRouter.post('/', authMiddleware, withAsync(createProduct));
productsRouter.post('/:id/comments', authMiddleware, withAsync(createComment));

//일반
productsRouter.get('/', withAsync(getProductList));
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
