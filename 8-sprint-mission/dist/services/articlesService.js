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
exports.createArticle = createArticle;
exports.getArticle = getArticle;
exports.getArticleList = getArticleList;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
const articlesRepository = __importStar(require("../repositories/articlesRepository"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
function createArticle(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdArticle = yield articlesRepository.createArticle(data);
        return Object.assign(Object.assign({}, createdArticle), { likeCount: 0, isLiked: false });
    });
}
function getArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articlesRepository.getArticleWithLkes(id);
        if (!article) {
            throw new NotFoundError_1.default('article', id);
        }
        return article;
    });
}
function getArticleList(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const articles = yield articlesRepository.getArticleListWithLikes(params);
        return articles;
    });
}
function updateArticle(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingArticle = yield articlesRepository.getArticle(id);
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', id);
        }
        if (existingArticle.userId !== data.userId) {
            throw new ForbiddenError_1.default('Should be the owner of the article');
        }
        const updatedArticle = yield articlesRepository.updateArticleWithLikes(id, data);
        return updatedArticle;
    });
}
function deleteArticle(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingArticle = yield articlesRepository.getArticle(id);
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', id);
        }
        if (existingArticle.userId !== userId) {
            throw new ForbiddenError_1.default('Should be the owner of the article');
        }
        yield articlesRepository.deleteArticle(id);
    });
}
