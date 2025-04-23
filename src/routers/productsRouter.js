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
import passport from '../lib/passport.js';
import productAuth from '../lib/middleware/productAuth.js';

const productsRouter = express.Router();

productsRouter.post(
  '/',
  passport.authenticate('access-token', { session: false }),
  withAsync(createProduct),
);
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.patch(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  productAuth.verifyProductOwner,
  withAsync(updateProduct),
);
productsRouter.delete(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  productAuth.verifyProductOwner,
  withAsync(deleteProduct),
);
productsRouter.get('/', withAsync(getProductList));
productsRouter.post(
  '/:id/comments',
  passport.authenticate('access-token', { session: false }),
  withAsync(createComment),
);
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
