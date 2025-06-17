import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import http from 'http';

import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import { initializeSocketServer } from './socket/socketService';
import { setSocketIO } from './socket/socketInstance';

import articlesRouter from './routers/articlesRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentsRouter';
import imagesRouter from './routers/imagesRouter';
import authRouter from './routers/authRouter';
import usersRouter from './routers/usersRouter';
import notificationsRouter from './routers/notificationsRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/', notificationsRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

const server = http.createServer(app);
const io = initializeSocketServer(server);
setSocketIO(io);
export default app;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
