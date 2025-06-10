import express from 'express';
import { withAsync } from '../lib/withAsync';
import { uploadImage } from '../controllers/imagesController';
import { upload } from '../lib/s3';

const imagesRouter = express.Router();

imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));

export default imagesRouter;
