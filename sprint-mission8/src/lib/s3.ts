import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import path from 'path';
import multer from 'multer';

config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only png, jpeg, and jpg are allowed'));
    }
    cb(null, true);
  },
});

export async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const ext = path.extname(file.originalname);
  const datePrefix = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  const key = `uploads/${datePrefix}/${randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
