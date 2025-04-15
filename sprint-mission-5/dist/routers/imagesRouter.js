import { Router } from 'express';
import { withAsync } from '../lib/withAsync.js';
import { upload, uploadImage } from '../controllers/imagesController.js';
const imagesRouter = Router();
imagesRouter.post('/upload', upload.single('image'), withAsync(uploadImage));
export default imagesRouter;
