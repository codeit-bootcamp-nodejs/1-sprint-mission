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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.verifyRefreshToken = void 0;
exports.verifyProductAuth = verifyProductAuth;
exports.verifyAricleAuth = verifyAricleAuth;
exports.verifyCommentAuth = verifyCommentAuth;
const constants_1 = require("../lib/constants");
const express_jwt_1 = require("express-jwt");
const prismaClient_1 = require("../lib/prismaClient");
// express-jwt 내부에서 next호출
// bearer에 있는 jwt가 검증이 되면 requestProperty에 저장
exports.verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: constants_1.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => req.cookies.refreshToken,
});
exports.verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: constants_1.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
});
// comment, article, product 인가
function verifyProductAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // 상품아이디
        const { id: productId } = req.params;
        const productIdInt = parseInt(productId, 10);
        const product = yield prismaClient_1.prismaClient.product.findUnique({
            where: { id: productIdInt },
        });
        // 상품id값확인
        if (!product) {
            throw new Error("product not found");
        }
        if (!req.user) {
            throw new Error("user not found");
        }
        // product모델의 userid값과 요청한 유저 아이디값
        if (product.userId !== req.user.id) {
            throw new Error("forbbiden");
        }
        return next();
    });
}
function verifyAricleAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = req.params;
        const articleIdInt = parseInt(articleId, 10);
        try {
            const article = yield prismaClient_1.prismaClient.article.findUnique({
                where: { id: articleIdInt },
            });
            if (!article) {
                throw new Error("product not found");
            }
            if (!req.user) {
                throw new Error("user not found");
            }
            if (article.userId !== req.user.id) {
                throw new Error("forbbiden");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
function verifyCommentAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: commentId } = req.params;
        const commentIdInt = parseInt(commentId, 10);
        try {
            const comment = yield prismaClient_1.prismaClient.comment.findUnique({
                where: { id: commentIdInt },
            });
            if (!comment) {
                throw new Error("comment not found");
            }
            if (!req.user) {
                throw new Error("user not found");
            }
            if (comment.userId !== req.user.id) {
                throw new Error("forbbiden");
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
