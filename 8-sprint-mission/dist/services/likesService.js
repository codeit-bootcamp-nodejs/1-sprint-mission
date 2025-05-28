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
exports.createLike = createLike;
exports.deleteLike = deleteLike;
const likesRepository = __importStar(require("../repositories/likesRepository"));
const articlesRepository = __importStar(require("../repositories/articlesRepository"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
function createLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingArticle = yield articlesRepository.getArticle(articleId);
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', articleId);
        }
        const existingLike = yield likesRepository.getLike(articleId, userId);
        if (existingLike) {
            throw new BadRequestError_1.default('Already liked');
        }
        yield likesRepository.createLike({ articleId, userId });
    });
}
function deleteLike(articleId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingArticle = yield articlesRepository.getArticle(articleId);
        if (!existingArticle) {
            throw new NotFoundError_1.default('article', articleId);
        }
        const existingLike = yield likesRepository.getLike(articleId, userId);
        if (!existingLike) {
            throw new BadRequestError_1.default('Not liked');
        }
        yield likesRepository.deleteLike(existingLike.id);
    });
}
