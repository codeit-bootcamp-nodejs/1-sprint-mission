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
exports.createUser = createUser;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.getUserInfo = getUserInfo;
exports.patchUser = patchUser;
exports.patchUserPassword = patchUserPassword;
const tokens_1 = require("../lib/tokens");
const userService_1 = __importDefault(require("../services/userService"));
// signUp
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nickname, password, image } = req.body;
        try {
            const user = yield userService_1.default.createUser({
                email,
                nickname,
                password,
                image,
            });
            return res.send(user);
        }
        catch (error) {
            return next(error);
        }
    });
}
// login
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield userService_1.default.validUser(email, password);
            const accessToken = (0, tokens_1.createToken)(user, "access");
            const refreshToken = (0, tokens_1.createToken)(user, "refresh");
            if (user.id) {
                yield userService_1.default.update(user.id, { refreshToken });
            }
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return res.status(200).send({ accessToken });
        }
        catch (error) {
            return next(error);
        }
    });
}
// token / refresh
function refreshToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.auth;
        const refreshToken = req.cookies.refreshToken;
        try {
            const accessToken = yield userService_1.default.refreshAccessToken(userId, refreshToken);
            return res.status(200).send({ accessToken });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getUserInfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const userId = user.id;
        try {
            const user = yield userService_1.default.meInfo(userId);
            return res.status(200).send(user);
        }
        catch (error) {
            next(error);
        }
    });
}
function patchUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const userId = user.id;
            const patchData = req.body;
            const patchedUser = yield userService_1.default.update(userId, patchData);
            return res.status(200).send(patchedUser);
        }
        catch (error) {
            next(error);
        }
    });
}
function patchUserPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const userId = user.id;
            const { password, newPassword } = req.body;
            yield userService_1.default.patchPassword(userId, password, newPassword);
            res.status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
