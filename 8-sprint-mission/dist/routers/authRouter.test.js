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
const main_1 = __importDefault(require("../../src/main"));
const prismaClient_1 = __importDefault(require("../../src/lib/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.test" });
const constants_1 = require("../../src/lib/constants");
describe("Auth API 통합 테스트", () => {
    let user;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.like.deleteMany();
        yield prismaClient_1.default.favorite.deleteMany();
        yield prismaClient_1.default.comment.deleteMany();
        yield prismaClient_1.default.product.deleteMany();
        yield prismaClient_1.default.article.deleteMany();
        yield prismaClient_1.default.user.deleteMany();
        const hashedPassword = yield bcrypt_1.default.hash("password1", 10);
        user = yield prismaClient_1.default.user.create({
            data: {
                email: "usertest@example.com",
                password: hashedPassword,
                nickname: "닉네임test",
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaClient_1.default.$disconnect();
    }));
    describe("POST /auth/login", () => {
        test("로그인 성공 시 200을 반환해야 함.", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(main_1.default)
                .post("/auth/login")
                .send({ email: "usertest@example.com", password: "password1" });
            expect(response.status).toBe(200);
        }));
    });
    describe("POST /auth/login", () => {
        test("로그아웃 시 200을 반환해야 함.", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(main_1.default).post("/auth/logout");
            expect(response.status).toBe(200);
        }));
    });
    describe("POST /auth/login", () => {
        test("회원가입 성공 시 201과 유저정보를 반환해야 함.", () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                email: "newUser@example.com",
                password: "password1",
                nickname: "테스트용 유저1",
                image: "",
            };
            const response = yield (0, supertest_1.default)(main_1.default).post("/auth/register").send(newUser);
            expect(response.status).toBe(201);
            expect(response.body.email).toBe("newUser@example.com");
            expect(response.body.image).toBe("");
            expect(typeof response.body.id).toBe("number");
        }));
    });
    describe("POST /auth/refresh", () => {
        test("토큰 재발급 성공시 200을 반환해야 함.", () => __awaiter(void 0, void 0, void 0, function* () {
            const testRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            const response = yield (0, supertest_1.default)(main_1.default)
                .post("/auth/refresh")
                .set("Cookie", [`${constants_1.REFRESH_TOKEN_COOKIE_NAME}=${testRefreshToken}`]);
            expect(response.status).toBe(200);
        }));
    });
});
