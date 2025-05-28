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
exports.createComment = createComment;
exports.getComment = getComment;
exports.getCommentListByArticleId = getCommentListByArticleId;
exports.getCommentListByProductId = getCommentListByProductId;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const articlesRepository = __importStar(require("../repositories/articlesRepository"));
const commentsRepository = __importStar(require("../repositories/commentsRepository"));
const productsRepository = __importStar(require("../repositories/productsRepository"));
const notificationRepository = __importStar(require("../repositories/notificationsRepository"));
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const socketService_1 = require("./socketService");
function createComment(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!data.articleId && !data.productId) {
            throw new BadRequestError_1.default("Either articleId or productId must be provided");
        }
        let authorId = null;
        if (data.articleId) {
            const article = yield articlesRepository.getArticle(data.articleId);
            if (!article) {
                throw new NotFoundError_1.default("article", data.articleId);
            }
            authorId = article.userId;
        }
        if (data.productId) {
            const product = yield productsRepository.getProduct(data.productId);
            if (!product) {
                throw new NotFoundError_1.default("product", data.productId);
            }
            authorId = product.userId;
        }
        const comment = yield commentsRepository.createComment(Object.assign(Object.assign({}, data), { articleId: (_a = data.articleId) !== null && _a !== void 0 ? _a : null, productId: (_b = data.productId) !== null && _b !== void 0 ? _b : null }));
        if (authorId && authorId !== data.userId) {
            const notification = yield notificationRepository.createNotification({
                userId: authorId,
                type: "NEW_COMMENT",
                payload: {
                    articleId: data.articleId,
                    content: data.content,
                },
            });
            (0, socketService_1.sendNotification)(authorId, notification);
        }
        return comment;
    });
}
function getComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield commentsRepository.getComment(id);
        if (!comment) {
            throw new NotFoundError_1.default("comment", id);
        }
        return comment;
    });
}
function getCommentListByArticleId(articleId, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const article = yield articlesRepository.getArticle(articleId);
        if (!article) {
            throw new NotFoundError_1.default("article", articleId);
        }
        const result = commentsRepository.getCommentList({ articleId }, params);
        return result;
    });
}
function getCommentListByProductId(productId, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productsRepository.getProduct(productId);
        if (!product) {
            throw new NotFoundError_1.default("product", productId);
        }
        const result = commentsRepository.getCommentList({ productId }, params);
        return result;
    });
}
function updateComment(id, userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield commentsRepository.getComment(id);
        if (!comment) {
            throw new NotFoundError_1.default("comment", id);
        }
        if (comment.userId !== userId) {
            throw new ForbiddenError_1.default("Should be the owner of the comment");
        }
        return commentsRepository.updateComment(id, { content });
    });
}
function deleteComment(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comment = yield commentsRepository.getComment(id);
        if (!comment) {
            throw new NotFoundError_1.default("comment", id);
        }
        if (comment.userId !== userId) {
            throw new ForbiddenError_1.default("Should be the owner of the comment");
        }
        yield commentsRepository.deleteComment(id);
    });
}
