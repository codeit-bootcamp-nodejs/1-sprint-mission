import { PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME, AWS_REGION } from '../lib/constants';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../lib/s3Client';

export async function uploadBufferToS3(
  buffer: Buffer,
  originalname: string,
  mimetype: string,
): Promise<string> {
  const ext = path.extname(originalname);
  const key = `uploads/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);

  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}
