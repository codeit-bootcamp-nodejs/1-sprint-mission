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
describe("Article API 통합 테스트", () => {
    let agent;
    let user;
    let article;
    let comment;
    let like;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        agent = supertest_1.default.agent(main_1.default);
        yield prismaClient_1.default.like.deleteMany();
        yield prismaClient_1.default.comment.deleteMany();
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
        article = yield prismaClient_1.default.article.create({
            data: {
                title: "테스트 게시글",
                content: "테스트용입니다.",
                image: null,
                userId: user.id,
            },
        });
        comment = yield prismaClient_1.default.comment.create({
            data: {
                content: "테스트 댓글입니다.",
                article: { connect: { id: article.id } },
                user: { connect: { id: user.id } },
            },
        });
    }));
    describe("Article POST", () => {
        describe("POST /articles 게시글 생성", () => {
            test("게시글 작성 성공 시 201, 게시글 정보 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const newArticle = {
                    title: "테스트 게시글2",
                    content: "테스트용입니다2.",
                    image: null,
                };
                const response = yield agent.post("/articles").send(newArticle);
                expect(response.status).toBe(201);
            }));
        });
        describe("POST /articles/:id/comments", () => {
            test("게시글에 댓글 생성 성공 시 201, 댓글 정보 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const newComment = {
                    content: "댓글생성테스트내용",
                };
                const response = yield agent
                    .post(`/articles/${article.id}/comments`)
                    .send(newComment);
                expect(response.status).toBe(201);
                expect(response.body.content).toBe("댓글생성테스트내용");
            }));
        });
        describe("POST /articles/:id/likes", () => {
            test("게시글에 like 성공 시 201 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.post(`/articles/${article.id}/likes`);
                expect(response.status).toBe(201);
            }));
        });
    });
    describe("Article GET", () => {
        describe("GET /게시글 조회", () => {
            test("게시글 조회 성공 시 게시글 정보 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.get(`/articles/${article.id}`);
                expect(response.body.content).toBe("테스트용입니다.");
            }));
        });
        describe("GET /게시글 목록 조회", () => {
            test("게시글 목록 조회 성공 시 게시글 목록 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.get("/articles");
                expect(response.body.list[0].content).toBe("테스트용입니다.");
            }));
        });
        describe("GET /게시글 댓글 목록 조회", () => {
            test("게시글 댓글 목록조회 성공 시 댓글 목록을 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.get(`/articles/${article.id}/comments`);
                expect(Array.isArray(response.body.list)).toBe(true);
            }));
        });
    });
    describe("Article PATCH", () => {
        describe("PATCH /게시글 수정", () => {
            test("게시글을 수정하면 수정된 게시글을 반환해야 함", () => __awaiter(void 0, void 0, void 0, function* () {
                const update = {
                    content: "수정한 상태입니다.",
                };
                const response = yield agent
                    .patch(`/articles/${article.id}`)
                    .send(update);
                expect(response.body.content).toBe("수정한 상태입니다.");
            }));
        });
    });
    describe("Article DELETE", () => {
        describe("DELETE /게시글 삭제", () => {
            test("게시글 삭제 성공 시 204 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield agent.delete(`/articles/${article.id}`);
                expect(response.status).toBe(204);
            }));
        });
        describe("DELETE /LIKE 삭제", () => {
            test("게시글의 LIKE삭제 성공 시 204 반환", () => __awaiter(void 0, void 0, void 0, function* () {
                const like = yield prismaClient_1.default.like.create({
                    data: {
                        article: { connect: { id: article.id } },
                        user: { connect: { id: user.id } },
                    },
                });
                const response = yield agent.delete(`/articles/${article.id}/likes`);
                expect(response.status).toBe(204);
            }));
        });
    });
});
