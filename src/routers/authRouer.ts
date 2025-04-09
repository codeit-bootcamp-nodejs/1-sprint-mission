import express from 'express';
import { withAsync } from '../lib/withAsync';
import { createUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register', withAsync(createUser));
authRouter.post('/login', withAsync(loginUser));
authRouter.post('/logout', withAsync(logoutUser));
authRouter.post('/refresh', withAsync(refreshToken));

export default authRouter;
