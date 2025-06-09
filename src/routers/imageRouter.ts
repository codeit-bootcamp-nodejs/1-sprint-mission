import express from 'express';
import { withAsync } from '../lib/withAsync';
import uploadImage from '../controllers/imageController';
import { uploader } from '../middlewares/uploader';

const imagesRouter = express.Router();

imagesRouter.post('/upload', uploader.single('image'), withAsync(uploadImage));

export default imagesRouter;
