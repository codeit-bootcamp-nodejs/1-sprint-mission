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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokens_1 = require("../lib/tokens");
// password hashing
function hashingPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.hash(password, 10);
    });
}
function isValidPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = yield bcrypt_1.default.compare(password, hashedPassword);
        if (!match) {
            throw new Error("unauthorized");
        }
    });
}
// password,token filter
// 비구조화할당 , rest operator
function filterSensitiveUserData(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password, refreshToken } = user, rest = __rest(user, ["password", "refreshToken"]);
        return rest;
    });
}
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nickname, password, image } = data;
        const existedUser = yield userRepository_1.default.getByEmail(email);
        if (existedUser) {
            throw new Error("already user Email");
        }
        const hashedPwd = yield hashingPassword(password);
        const newUser = yield userRepository_1.default.save(Object.assign(Object.assign({}, data), { password: hashedPwd, image: image || null }));
        return filterSensitiveUserData(newUser);
    });
}
function validUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.getByEmail(email);
        if (!user) {
            throw new Error("user not found");
        }
        yield isValidPassword(password, user.password);
        return filterSensitiveUserData(user);
    });
}
// refreshToken이 필요
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield userRepository_1.default.update(id, data);
    });
}
function meInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.getById(id);
        if (!user) {
            throw new Error("user not found");
        }
        return filterSensitiveUserData(user);
    });
}
function refreshAccessToken(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.getById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error("unauthorized");
        }
        const accessToken = (0, tokens_1.createToken)(user, "access");
        return accessToken;
    });
}
function patchPassword(id, password, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userRepository_1.default.getById(id);
        console.log(user);
        console.log("password:", password, "newPassword:", newPassword);
        if (!user) {
            throw new Error("user not found");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        console.log("Is password valid?", isPasswordValid); // 비교 결과를 확인
        console.log("Stored hashed password:", user.password); // 저장된 해시된 비밀번호 확인
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        console.log("hashed:", hashedPassword);
        yield userRepository_1.default.update(id, { password: hashedPassword });
        return { message: "patched password" };
    });
}
exports.default = {
    createUser,
    validUser,
    update,
    meInfo,
    refreshAccessToken,
    patchPassword,
};
