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
exports.refreshToken = refreshToken;
exports.updateMyPassword = updateMyPassword;
exports.authenticate = authenticate;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersRepository = __importStar(require("../repositories/usersRepository"));
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const token_1 = require("../lib/token");
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
function verifyPassword(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, user.password);
    });
}
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
function register(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield usersRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new BadRequestError_1.default("User already exists");
        }
        const hashedPassword = yield hashPassword(data.password);
        const user = yield usersRepository.createUser({
            email: data.email,
            nickname: data.nickname,
            password: hashedPassword,
            image: data.image,
        });
        return user;
    });
}
function login(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield usersRepository.getUserByEmail(data.email);
        if (!user) {
            throw new BadRequestError_1.default("Invalid email");
        }
        const isPasswordValid = yield verifyPassword(user, data.password);
        if (!isPasswordValid) {
            throw new BadRequestError_1.default("Invalid password");
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(user.id);
        return {
            accessToken,
            refreshToken,
        };
    });
}
function refreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!refreshToken) {
            throw new BadRequestError_1.default("Invalid refresh token");
        }
        const { userId } = (0, token_1.verifyRefreshToken)(refreshToken);
        const user = yield usersRepository.getUser(userId);
        if (!user) {
            throw new BadRequestError_1.default("Invalid refresh token");
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(userId);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    });
}
function updateMyPassword(userId, password, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield usersRepository.getUser(userId);
        if (!user) {
            throw new NotFoundError_1.default("user", userId);
        }
        const isPasswordValid = yield verifyPassword(user, password);
        if (!isPasswordValid) {
            throw new BadRequestError_1.default("Invalid credentials");
        }
        const hashedPassword = yield hashPassword(newPassword);
        yield usersRepository.updateUser(userId, { password: hashedPassword });
    });
}
function authenticate(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!accessToken) {
            throw new UnauthorizedError_1.default("Unauthorized");
        }
        const { userId } = (0, token_1.verifyAccessToken)(accessToken);
        const user = yield usersRepository.getUser(userId);
        if (!user) {
            throw new UnauthorizedError_1.default("Unauthorized");
        }
        return user;
    });
}
