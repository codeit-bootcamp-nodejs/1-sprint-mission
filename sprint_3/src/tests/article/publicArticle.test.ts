import request from "supertest";
import { app } from "../../app";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";

describe("인증되지 않은 게시글 관련 테스트", () => {
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

  describe("GET/articles", () => {
    test("게시글이 없을 때는 빈 배열을 반환", async () => {
      const response = await request(app).get("/articles");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ articles: [], totalCount: 0 });
    });

    test("모든 등록된 게시글을 반환", async () => {
      const email = "test5@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const article1 = await prisma.article.create({
        data: {
          title: "게시글1",
          content: "test content",
          authorId: user.id,
        },
      });

      const article2 = await prisma.article.create({
        data: {
          title: "게시글2",
          content: "test content",
          authorId: user.id,
        },
      });

      const response = await request(app).get("/articles");
      expect(response.status).toBe(200);
      expect(response.body.articles.length).toBe(2);
      expect(response.body.articles[0].title).toBe("게시글2");
      expect(response.body.articles[1].title).toBe("게시글1");
    });

    test("query 조회", async () => {
      const email = "test5@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const article1 = await prisma.article.create({
        data: {
          title: "게시글1",
          content: "test content",
          authorId: user.id,
        },
      });

      const article2 = await prisma.article.create({
        data: {
          title: "게시글2",
          content: "test content",
          authorId: user.id,
        },
      });
      const response = await request(app).get(
        "/articles?page=1&pageSize=10&orderBy=asc&search=게시글2"
      );

      expect(response.status).toBe(200);
      expect(response.body.articles[0].title).toBe("게시글2");
    });
  });

  describe("GET/articles/:id", () => {
    test("특정 게시글 조회", async () => {
      const email = "test6@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const article1 = await prisma.article.create({
        data: {
          title: "게시글1",
          content: "test content",
          authorId: user.id,
        },
      });

      const response = await request(app).get(`/articles/${article1.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", "게시글1");
      expect(response.body).toHaveProperty("id", article1.id);
    });

    test("존재하지 않는 게시글은 404 반환", async () => {
      const response = await request(app).get("/articles/100");
      expect(response.status).toBe(404);
    });
  });
});
