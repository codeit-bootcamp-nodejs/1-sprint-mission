import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from '../controllers/articlesController.js';
import passport from '../lib/passport.js';
import articleAuth from '../lib/middleware/articleAuth.js';

const articlesRouter = express.Router();

articlesRouter.post(
  '/',
  passport.authenticate('access-token', { session: false }),
  withAsync(createArticle),
);
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(updateArticle),
);
articlesRouter.delete(
  '/:id',
  passport.authenticate('access-token', { session: false }),
  articleAuth.verifyAricleOwner,
  withAsync(deleteArticle),
);
articlesRouter.post(
  '/:id/comments',
  passport.authenticate('access-token', { session: false }),
  withAsync(createComment),
);
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default articlesRouter;
