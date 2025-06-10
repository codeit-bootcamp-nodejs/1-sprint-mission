import { Request, Response } from 'express';
import { uploadToS3 } from '../lib/s3';
import BadRequestError from '../lib/errors/BadRequestError';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  const imageUrl = await uploadToS3(req.file);
  res.status(201).json({ url: imageUrl });
}
