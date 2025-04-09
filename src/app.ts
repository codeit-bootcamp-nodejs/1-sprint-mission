import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import authRouter from './routers/authRouer';
import articleRouter from './routers/articleRouter';
import productRouter from './routers/productRouter';
import commentsRouter from './routers/commentsRouter';
import usersRouter from './routers/userRouter';
import imagesRouter from './routers/imageRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/auth', authRouter);
app.use('/articles', articleRouter);
app.use('/products', productRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
