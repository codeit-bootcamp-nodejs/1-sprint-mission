"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const constants_1 = require("./constants");
const s3Client = constants_1.NODE_ENV === "production"
    ? new client_s3_1.S3Client({
        region: constants_1.AWS_REGION,
        credentials: {
            accessKeyId: constants_1.AWS_ACCESS_KEY_ID,
            secretAccessKey: constants_1.AWS_SECRET_ACCESS_KEY,
        },
    })
    : null;
exports.default = s3Client;
