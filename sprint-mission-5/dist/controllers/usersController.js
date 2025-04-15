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
import { UpdateMeBodyStruct, UpdatePasswordBodyStruct, GetMyProductListParamsStruct, GetMyFavoriteListParamsStruct, } from '../structs/usersStructs.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
export function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const user = yield prismaClient.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new NotFoundError('user', req.user.id);
        }
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.send(userWithoutPassword);
        return;
    });
}
export function updateMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const data = create(req.body, UpdateMeBodyStruct);
        const updatedUser = yield prismaClient.user.update({
            where: { id: req.user.id },
            data,
        });
        const { password: _ } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        res.status(200).send(userWithoutPassword);
        return;
    });
}
export function updateMyPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
        const user = yield prismaClient.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new NotFoundError('user', req.user.id);
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(newPassword, salt);
        yield prismaClient.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });
        res.status(200).send();
        return;
    });
}
export function getMyProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { page, pageSize, orderBy, keyword } = create(req.query, GetMyProductListParamsStruct);
        const where = keyword
            ? {
                OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
            }
            : {};
        const totalCount = yield prismaClient.product.count({
            where: Object.assign(Object.assign({}, where), { userId: req.user.id }),
        });
        const products = yield prismaClient.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where: Object.assign(Object.assign({}, where), { userId: req.user.id }),
            include: {
                favorites: true,
            },
        });
        const productsWithFavorites = products.map((product) => (Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: product.favorites.some((favorite) => { var _a; return favorite.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); }) })));
        res.send({
            list: productsWithFavorites,
            totalCount,
        });
        return;
    });
}
export function getMyFavoriteList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }
        const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);
        const where = keyword
            ? {
                OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
            }
            : {};
        const totalCount = yield prismaClient.product.count({
            where: Object.assign(Object.assign({}, where), { favorites: {
                    some: {
                        userId: req.user.id,
                    },
                } }),
        });
        const products = yield prismaClient.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
            where: Object.assign(Object.assign({}, where), { favorites: {
                    some: {
                        userId: req.user.id,
                    },
                } }),
            include: {
                favorites: true,
            },
        });
        const productsWithFavorites = products.map((product) => (Object.assign(Object.assign({}, product), { favorites: undefined, favoriteCount: product.favorites.length, isFavorited: true })));
        res.send({
            list: productsWithFavorites,
            totalCount,
        });
        return;
    });
}
