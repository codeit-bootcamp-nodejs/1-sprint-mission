import request from "supertest";
import { app } from "../../app";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";

describe("인증이 필요한 article 관련 테스트", () => {
  const password = "Password@1234";
  const passwordHashed = bcrypt.hashSync(password, 10);

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.like.deleteMany(),
      prisma.product.deleteMany(),
      prisma.article.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /articles", () => {
    test("게시글 등록", async () => {
      const email = "test11@test.com";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: "user",
        },
      });
      const agent = request.agent(app);
      const login = await agent.post("/users/login").send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = {
        title: "테스트 입니다.",
        content: "테스트 게시글입니다.",
      };

      const response = await agent.post("/articles").send(article);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe("테스트 입니다.");
      expect(response.body.content).toBe("테스트 게시글입니다.");
      expect(response.body.id).toBeDefined();
    });
  });

  describe("PATCH /articles/:id", () => {
    test("게시글 수정", async () => {
      const email = "test12@test.com";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: "user",
        },
      });

      const agent = request.agent(app);
      const login = await agent.post("/users/login").send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = await prisma.article.create({
        data: {
          title: "테스트 입니다.",
          content: "테스트 게시글입니다.",
          authorId: user.id,
        },
      });

      const update = {
        title: "테스트 2",
      };

      const response = await agent
        .patch(`/articles/${article.id}`)
        .send(update);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe("테스트 2");
    });
  });

  describe("DELETE /articles/:id", () => {
    test("게시글 삭제", async () => {
      const email = "test13@test.com";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: "user",
        },
      });

      const agent = request.agent(app);
      const login = await agent.post("/users/login").send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = await prisma.article.create({
        data: {
          title: "테스트 입니다.",
          content: "테스트 게시글입니다.",
          authorId: user.id,
        },
      });

      const response = await agent.delete(`/articles/${article.id}`).send();
      expect(response.status).toBe(204);
    });
  });
});
