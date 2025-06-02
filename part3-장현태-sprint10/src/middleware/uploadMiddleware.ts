import multer from "multer";
import { s3Uploader } from "../middleware/s3Uploader";
import { RequestHandler } from "express";

const environment = process.env.NODE_ENV || "Development";

const diskUpload = multer({ dest: "uploads/" }).single("file");
const memoryUpload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadMiddleware: RequestHandler = function (req, res, next) {
  if (environment === "Development") {
    diskUpload(req, res, next);
    res.status(201).send("File uploaded successfully");
    return;
  }

  if (environment === "Production") {
    // memoryUpload 실행 후 → 성공 시 → s3Uploader 실행
    memoryUpload(req, res, function (err) {
      if (err) return next(err);
      s3Uploader(req, res, next);
      return;
    });
  }
};
