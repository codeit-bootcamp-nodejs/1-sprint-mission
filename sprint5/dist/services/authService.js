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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.signupService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../lib/prismaClient");
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const signupService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, nickname, password }) {
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield prismaClient_1.prisma.user.create({
        data: {
            email,
            nickname,
            password: hashedPassword,
        },
    });
    const { password: _ } = newUser, safeUser = __rest(newUser, ["password"]);
    return safeUser;
});
exports.signupService = signupService;
const loginService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    const isValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isValid)
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token };
});
exports.loginService = loginService;
