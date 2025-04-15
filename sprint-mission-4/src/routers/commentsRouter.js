import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import authCommentUser from '../middlewares/authCommentUser.js';

const commentsRouter = express.Router();

//인증 인가 기능
commentsRouter.patch('/:id', authMiddleware, withAsync(authCommentUser), withAsync(updateComment));

commentsRouter.delete('/:id', authMiddleware, withAsync(authCommentUser), withAsync(deleteComment));

export default commentsRouter;
