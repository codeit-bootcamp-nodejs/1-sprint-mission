"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.defaultNotFoundHandler = void 0;
const superstruct_1 = require("superstruct");
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const errorGuards_1 = require("../lib/errors/errorGuards");
const defaultNotFoundHandler = (req, res, next) => {
    res.status(404).send({ message: 'Not found' });
};
exports.defaultNotFoundHandler = defaultNotFoundHandler;
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_1.default) {
        res.status(400).send({ message: err.message });
        return;
    }
    if ((0, errorGuards_1.isSyntaxErrorWithBody)(err)) {
        res.status(400).send({ message: 'Invalid JSON' });
        return;
    }
    if ((0, errorGuards_1.isPrismaError)(err)) {
        console.error(err);
        res.status(500).send({ message: 'Failed to process data' });
        return;
    }
    if (err instanceof NotFoundError_1.default) {
        res.status(404).send({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
    return;
};
exports.globalErrorHandler = globalErrorHandler;
