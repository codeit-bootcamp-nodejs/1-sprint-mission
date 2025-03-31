import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getArticleList,
  createComment,
  getCommentList,
} from '../controllers/articlesController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import authArticleUser from '../middlewares/authArticleUser.js';

const articlesRouter = express.Router();

//인증인가
articlesRouter.patch('/:id', authMiddleware, withAsync(authArticleUser), withAsync(updateArticle));

articlesRouter.delete('/:id', authMiddleware, withAsync(authArticleUser), withAsync(deleteArticle));

//인증만
articlesRouter.post('/', authMiddleware, withAsync(createArticle));
articlesRouter.post('/:id/comments', authMiddleware, withAsync(createComment));

//일반
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default articlesRouter;
