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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = createArticle;
exports.getArticle = getArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticleList = getArticleList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
exports.createLike = createLike;
exports.deleteLike = deleteLike;
const superstruct_1 = require("superstruct");
const commonStructs_1 = require("../structs/commonStructs");
const articlesStructs_1 = require("../structs/articlesStructs");
const commentsStruct_1 = require("../structs/commentsStruct");
const articlesService = __importStar(require("../services/articlesService"));
const commentsService = __importStar(require("../services/commentsService"));
const likesService = __importStar(require("../services/likesService"));
function createArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.CreateArticleBodyStruct);
        const article = yield articlesService.createArticle(Object.assign(Object.assign({}, data), { userId: req.user.id }));
        res.status(201).send(article);
    });
}
function getArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const article = yield articlesService.getArticle(id);
        res.send(article);
    });
}
function updateArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, articlesStructs_1.UpdateArticleBodyStruct);
        const updatedArticle = yield articlesService.updateArticle(id, Object.assign(Object.assign({}, data), { userId: req.user.id }));
        res.send(updatedArticle);
    });
}
function deleteArticle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield articlesService.deleteArticle(id, req.user.id);
        res.status(204).send();
    });
}
function getArticleList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = (0, superstruct_1.create)(req.query, articlesStructs_1.GetArticleListParamsStruct);
        const result = yield articlesService.getArticleList(params);
        res.send(result);
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { content } = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const createdComment = yield commentsService.createComment({
            articleId,
            content,
            userId: req.user.id,
        });
        res.status(201).send(createdComment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const { cursor, limit } = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const result = yield commentsService.getCommentListByArticleId(articleId, {
            cursor,
            limit,
        });
        res.send(result);
    });
}
function createLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield likesService.createLike(articleId, req.user.id);
        res.status(201).send();
    });
}
function deleteLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: articleId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield likesService.deleteLike(articleId, req.user.id);
        res.status(204).send();
    });
}
