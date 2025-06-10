"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_S3_BUCKET_NAME = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.AWS_REGION = exports.STATIC_PATH = exports.PUBLIC_PATH = exports.PORT = exports.NODE_ENV = exports.JWT_REFRESH_TOKEN_SECRET = exports.JWT_ACCESS_TOKEN_SECRET = exports.DATABASE_URL = exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ACCESS_TOKEN_COOKIE_NAME = "access-token";
exports.REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "";
exports.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "";
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.PORT = process.env.PORT || 3000;
exports.PUBLIC_PATH = "./public";
exports.STATIC_PATH = "/public";
exports.AWS_REGION = process.env.AWS_REGION || "";
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
exports.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
if (exports.NODE_ENV === "production") {
    if (!exports.AWS_REGION ||
        !exports.AWS_ACCESS_KEY_ID ||
        !exports.AWS_SECRET_ACCESS_KEY ||
        !exports.AWS_S3_BUCKET_NAME) {
        throw new Error("AWS 설정이 필요함");
    }
}
