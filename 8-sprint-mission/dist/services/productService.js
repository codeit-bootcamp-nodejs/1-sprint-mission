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
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
function createProduct(userId, product) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!product.name || !product.price) {
            throw new Error("required data");
        }
        if (!userId) {
            throw new Error("userId not found");
        }
        return yield productRepository_1.default.save(userId, product);
    });
}
function getProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseIntId = id;
        if (!id) {
            throw new Error("product id required");
        }
        return yield productRepository_1.default.getById(parseIntId);
    });
}
function updateProduct(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseIntId = id;
        const product = yield productRepository_1.default.getById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return yield productRepository_1.default.update(parseIntId, data);
    });
}
function removeProduct(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseIntId = id;
        const product = yield productRepository_1.default.getById(id);
        console.log(parseIntId, userId);
        if (!product) {
            throw new Error("Product not found");
        }
        return yield productRepository_1.default.remove(parseIntId);
    });
}
function getProductList(page, pageSize, orderBy, keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield productRepository_1.default.getProductList(page, pageSize, orderBy, keyword);
            return result;
        }
        catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    });
}
function addLike(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseIntProductId = productId;
        if (!parseIntProductId) {
            throw new Error("product not found");
        }
        const product = yield productRepository_1.default.getById(parseIntProductId);
        if (!product) {
            throw new Error("product not found");
        }
        yield productRepository_1.default.addLike(userId, parseIntProductId);
        return { isliked: true };
    });
}
function deleteLike(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const parseIntProductId = productId;
        if (!parseIntProductId) {
            throw new Error("product not found");
        }
        const product = yield productRepository_1.default.getById(parseIntProductId);
        if (!product) {
            throw new Error("product not found");
        }
        yield productRepository_1.default.deleteLike(userId, parseIntProductId);
        return { isliked: false };
    });
}
function getUserProducts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield productRepository_1.default.getUserId(userId);
        if (!products || products.length === 0) {
            throw new Error("not found");
        }
        return products;
    });
}
function getUserLikeProducts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield productRepository_1.default.userLikeProducts(userId);
        if (!products || products.length === 0) {
            throw new Error("not found");
        }
        return products;
    });
}
exports.default = {
    createProduct,
    getProduct,
    updateProduct,
    removeProduct,
    getProductList,
    addLike,
    deleteLike,
    getUserProducts,
    getUserLikeProducts,
};
