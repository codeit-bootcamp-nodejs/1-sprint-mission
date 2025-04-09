import express from 'express';
import { upload, uploadImage } from '../controllers/imageController';
import { withAsync } from '../lib/withAsync';

const imagesRouter = express.Router();

imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imagesRouter;
