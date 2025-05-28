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
const commentRepository_1 = __importDefault(require("../repositories/commentRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const productService_1 = __importDefault(require("./productService"));
function updateComment(id, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingComment = yield commentRepository_1.default.getCommentById(id);
        if (!existingComment) {
            throw new Error("comment not found");
        }
        return yield commentRepository_1.default.updateComment(id, content);
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingComment = yield commentRepository_1.default.getCommentById(id);
        if (!existingComment) {
            throw new Error("comment not found");
        }
        yield commentRepository_1.default.deleteComment(id);
    });
}
function createComment(productId, content, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield productService_1.default.getProduct(productId);
        if (!existingProduct) {
            throw new Error("product not found");
        }
        return commentRepository_1.default.createComment(productId, content, userId);
    });
}
function getComments(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield productService_1.default.getProduct(productId);
        if (!existingProduct) {
            throw new Error("product not found");
        }
        return productRepository_1.default.getById(productId);
    });
}
exports.default = {
    updateComment,
    deleteComment,
    createComment,
    getComments,
};
