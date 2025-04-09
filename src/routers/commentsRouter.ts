import express from 'express';
import { authenticate } from '../middlewares/authenticate';
import { withAsync } from '../lib/withAsync';
import { deleteComment, updateComment } from '../controllers/commentsController';

const commentsRouter = express.Router();
commentsRouter.patch('/:id', authenticate(), withAsync(updateComment));
commentsRouter.delete('/:id', authenticate(), withAsync(deleteComment));

export default commentsRouter;
