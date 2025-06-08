import express from 'express';
import { withAsync } from '../lib/withAsync';
import { upload, uploadImage } from '../controllers/imagesController';

const imagesRouter = express.Router();

imagesRouter.post('/upload', withAsync(uploadImage));

export default imagesRouter;
