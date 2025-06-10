"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
const superstruct_1 = require("superstruct");
const constants_1 = require("../lib/constants");
const authStructs_1 = require("../structs/authStructs");
const authService = __importStar(require("../services/authService"));
const userResponseDTO_1 = __importDefault(require("../dto/userResponseDTO"));
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, authStructs_1.RegisterBodyStruct);
        const user = yield authService.register(data);
        res.status(201).json((0, userResponseDTO_1.default)(user));
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, authStructs_1.LoginBodyStruct);
        const { accessToken, refreshToken } = yield authService.login(data);
        setTokenCookies(res, accessToken, refreshToken);
        res.status(200).send();
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        clearTokenCookies(res);
        res.status(200).send();
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME];
        const { accessToken, refreshToken: newRefreshToken } = yield authService.refreshToken(refreshToken);
        setTokenCookies(res, accessToken, newRefreshToken);
        res.status(200).send();
    });
}
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === "production",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(constants_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/auth/refresh",
    });
}
function clearTokenCookies(res) {
    res.clearCookie(constants_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_1.REFRESH_TOKEN_COOKIE_NAME);
}
