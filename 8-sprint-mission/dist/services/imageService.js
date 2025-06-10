"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.uploadImage = uploadImage;
exports.uploadImageLocal = uploadImageLocal;
exports.uploadImageS3 = uploadImageS3;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const constants_1 = require("../lib/constants");
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const s3Client_1 = __importDefault(require("../lib/s3Client"));
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const generateFilename = (file) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    return `${(0, uuid_1.v4)()}${ext}`;
};
exports.upload = (0, multer_1.default)({
    storage: constants_1.NODE_ENV === "production"
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, constants_1.PUBLIC_PATH);
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
            const error = new BadRequestError_1.default("file type png, jpeg, jpg");
            return cb(error);
        }
        cb(null, true);
    },
});
function uploadImage(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (constants_1.NODE_ENV === "production") {
            return uploadImageS3(file);
        }
        return uploadImageLocal(file);
    });
}
function uploadImageLocal(file) {
    if (!file) {
        throw new BadRequestError_1.default("파일이 없습니다.");
    }
    return uploadImageLocal(file);
}
function uploadImageS3(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new BadRequestError_1.default("파일이 없습니다.");
        }
        if (!s3Client_1.default) {
            throw new Error("s3 error");
        }
        const key = generateFilename(file);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: constants_1.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer, // 메모리 저장이기 때문에 buffer 사용
            ContentType: file.mimetype,
        });
        yield s3Client_1.default.send(command);
        const url = `https://${constants_1.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { url };
    });
}
