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
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
function defaultNotFoundHandler(req, res, next) {
    res.status(404).send({ message: 'Not found' });
}
function globalErrorHandler(err, req, res, next) {
    /** From superstruct or application error */
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_1.default) {
        res.status(400).send({ message: err.message });
        return;
    }
    /** From express.json middleware */
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).send({ message: 'Invalid JSON' });
        return;
    }
    /** Prisma error codes */
    if ('code' in err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to process data' });
        return;
    }
    /** Application errors */
    if (err instanceof NotFoundError_1.default) {
        res.status(404).send({ message: err.message });
        return;
    }
    if (err instanceof UnauthorizedError_1.default) {
        res.status(401).send({ message: err.message });
        return;
    }
    if (err instanceof ForbiddenError_1.default) {
        res.status(403).send({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
}
