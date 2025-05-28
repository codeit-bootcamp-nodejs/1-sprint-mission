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
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.getProductList = getProductList;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const productsRepository = __importStar(require("../repositories/productsRepository"));
const favoriteRepository = __importStar(require("../repositories/favoritesRepository"));
const notificationRepository = __importStar(require("../repositories/notificationsRepository"));
const socketService_1 = require("./socketService");
function createProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdProduct = yield productsRepository.createProduct(data);
        return Object.assign(Object.assign({}, createdProduct), { favoriteCount: 0, isFavorited: false });
    });
}
function getProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield productsRepository.getProductWithFavorites(id);
        if (!product) {
            throw new NotFoundError_1.default("product", id);
        }
        return product;
    });
}
function getProductList(params_1) {
    return __awaiter(this, arguments, void 0, function* (params, { userId } = {}) {
        const products = yield productsRepository.getProductListWithFavorites(params, { userId });
        return products;
    });
}
function updateProduct(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield productsRepository.getProduct(id);
        if (!existingProduct) {
            throw new NotFoundError_1.default("product", id);
        }
        if (existingProduct.userId !== data.userId) {
            throw new ForbiddenError_1.default("Should be the owner of the product");
        }
        const updatedProduct = yield productsRepository.updateProductWithFavorites(id, data);
        if (data.price && data.price !== existingProduct.price) {
            const likeUsers = yield favoriteRepository.getLikedUsers(id);
            for (const liked of likeUsers) {
                const notification = yield notificationRepository.createNotification({
                    userId: liked.userId,
                    type: "PRICE_CHANGE",
                    payload: {
                        id,
                        newPrice: data.price,
                    },
                });
                (0, socketService_1.sendNotification)(liked.userId, notification);
            }
        }
        return updatedProduct;
    });
}
function deleteProduct(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield productsRepository.getProduct(id);
        if (!existingProduct) {
            throw new NotFoundError_1.default("product", id);
        }
        if (existingProduct.userId !== userId) {
            throw new ForbiddenError_1.default("Should be the owner of the product");
        }
        yield productsRepository.deleteProduct(id);
    });
}
