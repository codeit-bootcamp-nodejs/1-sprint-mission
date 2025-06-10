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
// 테스트는 실제 데이터베이스 요청하면 ㅇ나됨, jest.mock()으로ㅓ 가짜함수로 바꾸는것
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const productsRepository = __importStar(require("../repositories/productsRepository"));
const productServices = __importStar(require("../services/productsService"));
jest.mock("../repositories/productsRepository");
describe("Products Service", () => {
    const mockProduct = {
        id: 1,
        name: "LG 그램",
        description: "LG",
        price: 29000,
        tags: ["electronics"],
        images: ["img.jpg"],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteCount: 0,
        isFavorited: false,
        favorites: undefined,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createProduct", () => {
        test("상품 생성할 수 있음", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .mocked(productsRepository.createProduct)
                .mockResolvedValue(mockProduct);
            const result = yield productServices.createProduct({
                name: mockProduct.name,
                description: mockProduct.description,
                price: mockProduct.price,
                tags: mockProduct.tags,
                images: mockProduct.images,
                userId: mockProduct.userId,
            });
            expect(result).toEqual(Object.assign(Object.assign({}, mockProduct), { favoriteCount: 0, isFavorited: false }));
            expect(productsRepository.createProduct).toHaveBeenCalledWith({
                name: mockProduct.name,
                description: mockProduct.description,
                price: mockProduct.price,
                tags: mockProduct.tags,
                images: mockProduct.images,
                userId: mockProduct.userId,
            });
        }));
    });
    describe("getProduct", () => {
        test("상품을 조회할 수 있음", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .mocked(productsRepository.getProductWithFavorites)
                .mockResolvedValue(mockProduct);
            const result = yield productServices.getProduct(mockProduct.id);
            expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(mockProduct.id);
            expect(result).toEqual(Object.assign(Object.assign({}, mockProduct), { favoriteCount: 0, isFavorited: false }));
        }));
        test("존재하지 않는 상품의 ID값이면 NotFoundError를 발생", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .mocked(productsRepository.getProductWithFavorites)
                .mockResolvedValue(null);
            // 에러 케이스를 테스트 할 때 변수에 할당해서 비동기함수가 에러를 던지는지 확인
            // const result = await ... 방식으로하면 에러가발생하게되고 이후 코드가 실행x 테스트 못함
            // 에러 테스트는 함수실행자체를 rejects.tothrow로 감싸면 됨
            yield expect(productServices.getProduct(999)).rejects.toThrow(new NotFoundError_1.default("product", 999));
        }));
    });
    describe("getProductsList", () => {
        test("상품목록을 조회할 수 있음", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .mocked(productsRepository.getProductListWithFavorites)
                .mockResolvedValue({ list: [mockProduct], totalCount: 1 });
            const params = { page: 1, pageSize: 10 };
            const result = yield productServices.getProductList(params, {
                userId: mockProduct.userId,
            });
            expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(params, { userId: mockProduct.userId });
            expect(result).toEqual({ list: [mockProduct], totalCount: 1 });
        }));
    });
    describe("updateProduct", () => {
        test("해당 상품의 정보를 수정할 수 있음", () => __awaiter(void 0, void 0, void 0, function* () {
            const updateData = {
                name: "삼성노트북",
                description: "삼성",
                price: 29000,
                userId: 1,
            };
            const updated = Object.assign(Object.assign({}, mockProduct), updateData);
            jest.mocked(productsRepository.getProduct).mockResolvedValue(mockProduct);
            jest
                .mocked(productsRepository.updateProductWithFavorites)
                .mockResolvedValue(updated);
            const result = yield productServices.updateProduct(mockProduct.id, updated);
            expect(productsRepository.getProduct).toHaveBeenCalledWith(mockProduct.id);
            expect(productsRepository.updateProductWithFavorites).toHaveBeenCalledWith(mockProduct.id, updated);
            expect(result).toEqual(updated);
        }));
    });
    describe("deleteProduct", () => {
        test("해당 상품을 삭제할 수 있음", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(productsRepository, "getProduct")
                .mockResolvedValue(mockProduct);
            const deleteMock = jest
                .spyOn(productsRepository, "deleteProduct")
                .mockResolvedValue(mockProduct);
            yield productServices.deleteProduct(mockProduct.id, mockProduct.userId);
            expect(deleteMock).toHaveBeenCalledWith(mockProduct.id);
            expect(deleteMock).toHaveReturnedTimes(1);
        }));
        test("본인이 아닌 상품일 경우 ForbiddenError 발생", () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserProduct = Object.assign(Object.assign({}, mockProduct), { userId: 2 });
            jest
                .spyOn(productsRepository, "getProduct")
                .mockResolvedValue(otherUserProduct);
            yield expect(productServices.deleteProduct(mockProduct.id, 1)).rejects.toThrow(new ForbiddenError_1.default("Should be the owner of the product"));
        }));
    });
});
