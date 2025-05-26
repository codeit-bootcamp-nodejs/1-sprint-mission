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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProducts = exports.updateMyPassword = exports.updateMyInfo = void 0;
exports.getMyInfo = getMyInfo;
const usersService_1 = require("../services/usersService");
function getMyInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            return res.status(401).json({ message: '로그인이 필요합니다' });
        const _a = req.user, { password: _ } = _a, safeUser = __rest(_a, ["password"]);
        res.json(safeUser);
    });
}
const updateMyInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield (0, usersService_1.updateMyInfoService)(req.user.id, req.body);
    res.status(200).json(updatedUser);
});
exports.updateMyInfo = updateMyInfo;
const updateMyPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력하세요.' });
    }
    yield (0, usersService_1.updateMyPasswordService)(req.user.id, currentPassword, newPassword);
    res.status(204).send();
});
exports.updateMyPassword = updateMyPassword;
const getMyProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myProducts = yield (0, usersService_1.getMyProductsService)(req.user.id);
    res.status(200).json(myProducts);
});
exports.getMyProducts = getMyProducts;
