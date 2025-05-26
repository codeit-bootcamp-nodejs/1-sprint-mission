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
exports.authenticate = void 0;
const prismaClient_1 = require("../lib/prismaClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: '토큰이 없습니다.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
            return;
        }
        const user = yield prismaClient_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        return;
    }
});
exports.authenticate = authenticate;
