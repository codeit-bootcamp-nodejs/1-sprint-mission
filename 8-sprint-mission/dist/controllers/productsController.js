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
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductList = getProductList;
exports.createComment = createComment;
exports.getCommentList = getCommentList;
exports.createFavorite = createFavorite;
exports.deleteFavorite = deleteFavorite;
const superstruct_1 = require("superstruct");
const commonStructs_1 = require("../structs/commonStructs");
const productsStruct_1 = require("../structs/productsStruct");
const commentsStruct_1 = require("../structs/commentsStruct");
const productsService = __importStar(require("../services/productsService"));
const commentsService = __importStar(require("../services/commentsService"));
const favoritesService = __importStar(require("../services/favoritesService"));
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, productsStruct_1.CreateProductBodyStruct);
        const createdProduct = yield productsService.createProduct(Object.assign(Object.assign({}, data), { userId: req.user.id }));
        res.status(201).send(createdProduct);
    });
}
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const product = yield productsService.getProduct(id);
        res.send(product);
    });
}
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const data = (0, superstruct_1.create)(req.body, productsStruct_1.UpdateProductBodyStruct);
        const updatedProduct = yield productsService.updateProduct(id, Object.assign(Object.assign({}, data), { userId: req.user.id }));
        res.send(updatedProduct);
    });
}
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield productsService.deleteProduct(id, req.user.id);
        res.status(204).send();
    });
}
function getProductList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const params = (0, superstruct_1.create)(req.query, productsStruct_1.GetProductListParamsStruct);
        const result = yield productsService.getProductList(params, {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        res.send(result);
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, superstruct_1.create)(req.body, commentsStruct_1.CreateCommentBodyStruct);
        const createdComment = yield commentsService.createComment(Object.assign(Object.assign({}, data), { userId: req.user.id }));
        res.status(201).send(createdComment);
    });
}
function getCommentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        const params = (0, superstruct_1.create)(req.query, commentsStruct_1.GetCommentListParamsStruct);
        const result = yield commentsService.getCommentListByProductId(productId, params);
        res.send(result);
    });
}
function createFavorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield favoritesService.createFavorite(productId, req.user.id);
        res.status(201).send();
    });
}
function deleteFavorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: productId } = (0, superstruct_1.create)(req.params, commonStructs_1.IdParamsStruct);
        yield favoritesService.deleteFavorite(productId, req.user.id);
        res.status(204).send();
    });
}
