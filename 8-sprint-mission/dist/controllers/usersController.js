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
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.updateMyPassword = updateMyPassword;
exports.getMyProductList = getMyProductList;
exports.getMyFavoriteList = getMyFavoriteList;
const superstruct_1 = require("superstruct");
const usersStructs_1 = require("../structs/usersStructs");
const usersService = __importStar(require("../services/usersService"));
const authService = __importStar(require("../services/authService"));
const userResponseDTO_1 = __importDefault(require("../dto/userResponseDTO"));
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield usersService.getUser(req.user.id);
        res.send((0, userResponseDTO_1.default)(user));
    });
}
function updateMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, usersStructs_1.UpdateMeBodyStruct);
        const updatedUser = yield usersService.updateUser(req.user.id, data);
        res.status(200).send((0, userResponseDTO_1.default)(updatedUser));
    });
}
function updateMyPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password, newPassword } = (0, superstruct_1.create)(req.body, usersStructs_1.UpdatePasswordBodyStruct);
        yield authService.updateMyPassword(req.user.id, password, newPassword);
        res.status(200).send();
    });
}
function getMyProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, usersStructs_1.GetMyProductListParamsStruct);
        const { list, totalCount } = yield usersService.getMyProductList(req.user.id, {
            page,
            pageSize,
            orderBy,
            keyword,
        });
        res.send({
            list,
            totalCount,
        });
    });
}
function getMyFavoriteList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, pageSize, orderBy, keyword } = (0, superstruct_1.create)(req.query, usersStructs_1.GetMyFavoriteListParamsStruct);
        const { list, totalCount } = yield usersService.getMyFavoriteList(req.user.id, {
            page,
            pageSize,
            orderBy,
            keyword,
        });
        res.send({
            list,
            totalCount,
        });
    });
}
