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
import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants.js';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
export function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nickname, password } = create(req.body, RegisterBodyStruct);
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const isExist = yield prismaClient.user.findUnique({ where: { email } });
        if (isExist) {
            throw new BadRequestError('User already exists');
        }
        const user = yield prismaClient.user.create({
            data: { email, nickname, password: hashedPassword },
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(201).json(userWithoutPassword);
    });
}
export function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = create(req.body, LoginBodyStruct);
        const user = yield prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid credentials');
        }
        const { accessToken, refreshToken } = generateTokens(user.id);
        setTokenCookies(res, accessToken, refreshToken);
        res.status(200).send();
    });
}
export function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        clearTokenCookies(res);
        res.status(200).send();
    });
}
export function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) {
            throw new BadRequestError('Invalid refresh token');
        }
        const { id: userId } = verifyRefreshToken(refreshToken);
        const user = yield prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new BadRequestError('Invalid refresh token');
        }
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);
        setTokenCookies(res, accessToken, newRefreshToken);
        res.status(200).send();
    });
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh',
    });
}
function clearTokenCookies(res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
