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
const supertest_1 = __importDefault(require("supertest"));
const main_1 = __importDefault(require("../main"));
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.test" });
describe("product API 통합 테스트 (쿠키 인증 기반)", () => {
    let product;
    let user;
    let agent;
    let comment;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        agent = supertest_1.default.agent(main_1.default);
        yield prismaClient_1.default.like.deleteMany();
        yield prismaClient_1.default.favorite.deleteMany();
        yield prismaClient_1.default.comment.deleteMany();
        yield prismaClient_1.default.product.deleteMany();
        yield prismaClient_1.default.article.deleteMany();
        yield prismaClient_1.default.user.deleteMany();
        const hashedPassword = yield bcrypt_1.default.hash("password1", 10);
        user = yield prismaClient_1.default.user.create({
            data: {
                email: "test@example.com",
                password: hashedPassword,
                nickname: "테스트유저",
            },
        });
        yield agent
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password1" })
            .expect(200);
        product = yield prismaClient_1.default.product.create({
            data: {
                name: "테스트 상품",
                price: 1000,
                description: "설명",
                user: {
                    connect: { id: user.id },
                },
            },
        });
        comment = yield prismaClient_1.default.comment.create({
            data: {
                content: "테스트 댓글입니다.",
                product: { connect: { id: product.id } },
                user: { connect: { id: user.id } },
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
    describe("Product POST", () => {
        describe("POST /products 상품 등록 ", () => {
            test("상품 등록 성공 시 201 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const productData = {
                    name: "새로운 상품",
                    price: 2000,
                    description: "새 상품 설명",
                    tags: ["새로운 태그", "테스트 태그"],
                    images: [],
                };
                const response = yield agent.post("/products").send(productData);
                expect(response.status).toBe(201);
                expect(response.body.name).toBe("새로운 상품");
            }));
        });
        describe("POST /products/:id/comments 해당 상품에 댓글 작성", () => {
            test("상품에 댓글 작성 성공시 201 댓글정보 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent
                    .post(`/products/${product.id}/comments`)
                    .send({
                    content: "댓글입니다.",
                    productId: product.id,
                });
                expect(response.status).toBe(201);
                expect(response.body.content).toBe("댓글입니다.");
            }));
        });
        describe("POST /products/:id/favorites 해당 상품에 찜하기", () => {
            test("상품에 찜하기시 201 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.post(`/products/${product.id}/favorites`);
                expect(response.status).toBe(201);
            }));
        });
    });
    describe("Product GET", () => {
        describe("GET /products 상품 목록 조회 (비로그인)", () => {
            test("GET /products", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(main_1.default).get("/products");
                expect(response.body.list.length).toBeGreaterThan(0);
                expect(response.body.list[0].name).toBe("테스트 상품");
            }));
        });
        describe("GET /products 상품 목록 조회 (로그인)", () => {
            test("GET /products", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.get("/products");
                expect(response.body.list.length).toBeGreaterThan(0);
                expect(response.body.list[0].name).toBe("테스트 상품");
            }));
        });
        describe("GET /products/:id/comments 상품의 댓글 목록 조회", () => {
            test("상품의 댓글목록을 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(main_1.default).get(`/products/${product.id}/comments`);
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.list)).toBe(true);
                expect(response.body.list.length).toBeGreaterThan(0);
            }));
        });
        describe("GET /products/:id", () => {
            test("상품 조회 성공시 200 응답 상품데이터 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.get(`/products/${product.id}`);
                expect(response.status).toBe(200);
                expect(response.body.name).toBe("테스트 상품");
            }));
        });
    });
    describe("Product PATCH", () => {
        describe("PATCH /products/:id", () => {
            test("상품 정보 수정 성공시 수정된 상품정보반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const patchData = {
                    name: "수정된 상품",
                    price: 5000,
                    description: "변경 테스트",
                    tags: ["변경된 태그", "변경 태그"],
                    images: [],
                };
                const response = yield agent
                    .patch(`/products/${product.id}`)
                    .send(patchData);
                expect(response.body.name).toBe("수정된 상품");
            }));
        });
    });
    describe("Product DELETE", () => {
        describe("DELETE /products/:id", () => {
            test("상품을 삭제 성공시 204반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.delete(`/products/${product.id}`);
                expect(response.status).toBe(204);
            }));
        });
        describe("DELETE /products/:id/favorites", () => {
            test("해당 상품의 찜하기 해제 204 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                yield prismaClient_1.default.favorite.create({
                    data: {
                        userId: user.id,
                        productId: product.id,
                    },
                });
                const response = yield agent.delete(`/products/${product.id}/favorites`);
                expect(response.status).toBe(204);
            }));
        });
    });
});
