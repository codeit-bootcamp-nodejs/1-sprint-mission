import multer, { FileFilterCallback } from "multer";
import path from "path";
import BadRequestError from "../lib/error/BadReqestError";
import { PUBLIC_PATH, STATIC_PATH } from "../lib/constants";
import { Request, RequestHandler } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PUBLIC_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    const err = new BadRequestError("이미지 파일을 업로드 해주세요.");
    return cb(err);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const imageUpload: RequestHandler = (req, res) => {
  if (req.file) {
    const host = req.get("host");
    const filePaths = path.join(STATIC_PATH, req.file.filename);
    const url = `http://${host}/${filePaths}`;
    res.status(200).send({ url });
  }
  res.status(400).send({ message: "업로드 된 파일이 없습니다." });
};

export { upload, imageUpload };
