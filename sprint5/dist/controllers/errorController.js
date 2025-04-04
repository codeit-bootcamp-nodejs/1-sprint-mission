"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNotFoundHandler = defaultNotFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
const superstruct_1 = require("superstruct");
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const errorGuards_1 = require("../lib/errors/errorGuards");
function defaultNotFoundHandler(req, res, next) {
    return res.status(404).send({ message: 'Not found' });
}
function globalErrorHandler(err, req, res, next) {
    /** From superstruct or application error */
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_1.default) {
        return res.status(400).send({ message: err.message });
    }
    /** From express.json middleware */
    if ((0, errorGuards_1.isSyntaxErrorWithBody)(err)) {
        return res.status(400).send({ message: 'Invalid JSON' });
    }
    /** Prisma error codes */
    if ((0, errorGuards_1.isPrismaError)(err)) {
        console.error(err);
        return res.status(500).send({ message: 'Failed to process data' });
    }
    /** Application error */
    if (err instanceof NotFoundError_1.default) {
        return res.status(404).send({ message: err.message });
    }
    console.error(err);
    return res.status(500).send({ message: 'Internal server error' });
}
