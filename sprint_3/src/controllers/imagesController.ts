import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { PUBLIC_PATH, STATIC_PATH, NODE_ENV } from "../lib/constants";
import { Request, RequestHandler } from "express";
import BadRequestError from "../lib/error/BadReqestError";
import s3 from "../config/s3";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new BadRequestError("이미지 파일을 업로드 해주세요."));
  }
  return cb(null, true);
};

const production = NODE_ENV === "production";

const upload = multer({
  storage: production
    ? multerS3({
        s3,
        bucket: "pandamarket-yeonjeong",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const fileName = Date.now().toString() + "-" + file.originalname;
          cb(null, fileName);
        },
      })
    : multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, PUBLIC_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
});

const imageUpload: RequestHandler = (req, res) => {
  if (req.file) {
    if (production) {
      const file = req.file as Express.MulterS3.File;
      res.status(200).send({ url: file.location });
      return;
    } else {
      const host = req.get("host");
      const filePaths = path.join(STATIC_PATH, req.file.filename);
      const url = `http://${host}/${filePaths}`;
      res.status(200).send({ url });
      return;
    }
  }
  res.status(400).send({ message: "업로드 된 파일이 없습니다." });
};

export { upload, imageUpload };
