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
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
function createArticle(userId, articleData) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = Object.assign(Object.assign({}, articleData), { userId });
        return articleRepository_1.default.save(data);
    });
}
function getArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.getArticleById(id);
    });
}
function updateArticle(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.update(id, data);
    });
}
function deleteArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.remove(id);
    });
}
function getArticleList(page, pageSize, orderBy, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = keyword ? { title: { contains: keyword } } : {};
        const orderByObj = { createdAt: orderBy }; //강제변하ㅗㄴ
        return articleRepository_1.default.getArticleList(where, (page - 1) * pageSize, pageSize, orderByObj);
    });
}
function createComment(articleId, userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.createComment({ articleId, userId, content });
    });
}
function getCommentList(articleId, page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.getCommentList(articleId, (page - 1) * pageSize, pageSize);
    });
}
function postArticlesLike(userId, articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.addLike(userId, articleId);
    });
}
function deleteArticlesLike(userId, articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        return articleRepository_1.default.removeLike(userId, articleId);
    });
}
exports.default = {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    getArticleList,
    createComment,
    getCommentList,
    postArticlesLike,
    deleteArticlesLike,
};
