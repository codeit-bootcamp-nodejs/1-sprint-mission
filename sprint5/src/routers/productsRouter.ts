import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController';
import { authenticate } from '../middlewares/auth';

const productsRouter = express.Router();

productsRouter.post('/', authenticate, withAsync(createProduct));
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.patch('/:id', authenticate, withAsync(updateProduct));
productsRouter.delete('/:id', authenticate, withAsync(deleteProduct));
productsRouter.get('/', withAsync(getProductList));
productsRouter.post('/:id/comments', authenticate, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));


export default productsRouter;
