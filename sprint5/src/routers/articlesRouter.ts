import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from '../controllers/articlesController';
import { authenticate } from '../middlewares/auth';

const articlesRouter = express.Router();

articlesRouter.post('/', authenticate, withAsync(createArticle));
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch('/:id', authenticate, withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate, withAsync(deleteArticle));
articlesRouter.post('/:id/comments', authenticate, withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default articlesRouter;
