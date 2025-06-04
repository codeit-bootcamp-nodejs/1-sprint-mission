import request from "supertest";
import app from "../main";
import prismaClient from "../lib/prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

describe("Article API 통합 테스트", () => {
  let agent: any;
  let user: any;
  let article: any;
  let comment: any;
  let like: any;
  beforeEach(async () => {
    agent = request.agent(app);

    await prismaClient.like.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password1", 10);
    user = await prismaClient.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        nickname: "테스트유저",
      },
    });

    await agent
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password1" })
      .expect(200);

    article = await prismaClient.article.create({
      data: {
        title: "테스트 게시글",
        content: "테스트용입니다.",
        image: null,
        userId: user.id,
      },
    });

    comment = await prismaClient.comment.create({
      data: {
        content: "테스트 댓글입니다.",
        article: { connect: { id: article.id } },
        user: { connect: { id: user.id } },
      },
    });
  });

  describe("Article POST", () => {
    describe("POST /articles 게시글 생성", () => {
      test("게시글 작성 성공 시 201, 게시글 정보 반환해야 함", async () => {
        const newArticle = {
          title: "테스트 게시글2",
          content: "테스트용입니다2.",
          image: null,
        };

        const response = await agent.post("/articles").send(newArticle);
        expect(response.status).toBe(201);
      });
    });

    describe("POST /articles/:id/comments", () => {
      test("게시글에 댓글 생성 성공 시 201, 댓글 정보 반환해야 함", async () => {
        const newComment = {
          content: "댓글생성테스트내용",
        };

        const response = await agent
          .post(`/articles/${article.id}/comments`)
          .send(newComment);
        expect(response.status).toBe(201);
        expect(response.body.content).toBe("댓글생성테스트내용");
      });
    });

    describe("POST /articles/:id/likes", () => {
      test("게시글에 like 성공 시 201 반환해야 함", async () => {
        const response = await agent.post(`/articles/${article.id}/likes`);
        expect(response.status).toBe(201);
      });
    });
  });

  describe("Article GET", () => {
    describe("GET /게시글 조회", () => {
      test("게시글 조회 성공 시 게시글 정보 반환해야 함", async () => {
        const response = await agent.get(`/articles/${article.id}`);
        expect(response.body.content).toBe("테스트용입니다.");
      });
    });

    describe("GET /게시글 목록 조회", () => {
      test("게시글 목록 조회 성공 시 게시글 목록 반환해야 함", async () => {
        const response = await agent.get("/articles");
        expect(response.body.list[0].content).toBe("테스트용입니다.");
      });
    });

    describe("GET /게시글 댓글 목록 조회", () => {
      test("게시글 댓글 목록조회 성공 시 댓글 목록을 반환해야 함", async () => {
        const response = await agent.get(`/articles/${article.id}/comments`);
        expect(Array.isArray(response.body.list)).toBe(true);
      });
    });
  });

  describe("Article PATCH", () => {
    describe("PATCH /게시글 수정", () => {
      test("게시글을 수정하면 수정된 게시글을 반환해야 함", async () => {
        const update = {
          content: "수정한 상태입니다.",
        };
        const response = await agent
          .patch(`/articles/${article.id}`)
          .send(update);
        expect(response.body.content).toBe("수정한 상태입니다.");
      });
    });
  });

  describe("Article DELETE", () => {
    describe("DELETE /게시글 삭제", () => {
      test("게시글 삭제 성공 시 204 반환", async () => {
        const response = await agent.delete(`/articles/${article.id}`);
        expect(response.status).toBe(204);
      });
    });

    describe("DELETE /LIKE 삭제", () => {
      test("게시글의 LIKE삭제 성공 시 204 반환", async () => {
        const like = await prismaClient.like.create({
          data: {
            article: { connect: { id: article.id } },
            user: { connect: { id: user.id } },
          },
        });
        const response = await agent.delete(`/articles/${article.id}/likes`);
        expect(response.status).toBe(204);
      });
    });
  });
});
