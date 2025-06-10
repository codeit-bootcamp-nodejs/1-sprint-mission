import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_S3_BUCKET_NAME, NODE_ENV, PUBLIC_PATH } from "../lib/constants";
import BadRequestError from "../lib/errors/BadRequestError";
import s3Client from "../lib/s3Client";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const generateFilename = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname).toLowerCase();
  return `${uuidv4()}${ext}`;
};

export const upload = multer({
  storage:
    NODE_ENV === "production"
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination(req, file, cb) {
            cb(null, PUBLIC_PATH);
          },
          filename(req, file, cb) {
            cb(null, generateFilename(file));
          },
        }),
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const error = new BadRequestError("file type png, jpeg, jpg");
      return cb(error);
    }
    cb(null, true);
  },
});

export async function uploadImage(file?: Express.Multer.File) {
  if (NODE_ENV === "production") {
    return uploadImageS3(file);
  }
  return uploadImageLocal(file);
}

export function uploadImageLocal(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError("파일이 없습니다.");
  }
  return uploadImageLocal(file);
}

export async function uploadImageS3(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestError("파일이 없습니다.");
  }
  if (!s3Client) {
    throw new Error("s3 error");
  }

  const key = generateFilename(file);

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer, // 메모리 저장이기 때문에 buffer 사용
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const url = `https://${AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { url };
}
