import request from "supertest";
import app from "./app";
import prisma from "./config/prisma";
import { Article } from "@prisma/client";
import { hashingPassword } from "./services/userService";

describe("Article 관련 통합 테스트'", () => {
  beforeAll(async () => {
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$executeRawUnsafe(`
  ALTER SEQUENCE "User_id_seq" RESTART WITH 2;
`);
    const hashedPassword = await hashingPassword("password");
    await prisma.user.create({
      data: {
        id: 1,
        email: "test@example.com",
        nickname: "test",
        password: hashedPassword,
        image: "https://example.com/image.jpg",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("인증이 필요없는 Article 요청", () => {
    let articles: Article[];
    describe("Article 목록조회_쿼리 파라미터 테스트", () => {
      beforeAll(async () => {
        await prisma.article.createMany({
          data: [
            {
              title: "First article",
              content: "Hello world",
              authorId: 1,
              createdAt: new Date("2023-01-01T00:00:00.000Z"),
            },
            {
              title: "Second article",
              content: "Content about testing",
              authorId: 1,
              createdAt: new Date("2023-01-02T00:00:00.000Z"),
            },
            {
              title: "Third article",
              content: "Search keyword appears here",
              authorId: 1,
              createdAt: new Date("2023-01-03T00:00:00.000Z"),
            },
          ],
        });
        articles = await prisma.article.findMany();
      });

      test("쿼리 파라미터 없이 Article 목록 조회 테스트 ", async () => {
        const res = await request(app).get("/articles");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

      test("쿼리 파라미터 limit=2 테스트", async () => {
        const response = await request(app).get("/articles?limit=2");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
      });

      test("쿼리 파라미터 limit=2&offset=2&order=oldest 테스트", async () => {
        const full = await request(app).get("/articles?order=oldest");
        const offset = await request(app).get(
          "/articles?limit=2&offset=2&order=oldest"
        );

        expect(offset.status).toBe(200);
        expect(offset.body.length).toBeLessThanOrEqual(2);

        const expected = full.body.slice(2, 4);

        expect(offset.body).toEqual(expected); // 순서와 값까지 정확히 일치해야 함
      });
      test("쿼리 파라미터 search=Se 테스트", async () => {
        const response = await request(app).get("/articles?search=Se");
        expect(response.status).toBe(200);
        for (const article of response.body) {
          const inTitle = article.title.includes("Se");
          const inContent = article.content.includes("Se");
          expect(inTitle || inContent).toBe(true);
        }
      });
    });
    test("Article 상세조회", async () => {
      const response = await request(app).get(`/articles/${articles[0].id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toMatch(/^c[a-z0-9]{24}$/); // id 값 cuid 형식 확인
    });
  });

  describe("인증이 필요한 Article 요청", () => {
    const agent = request.agent(app);
    let token: string;
    let updateTestArticle: Article;
    let deleteTestArticle: Article;
    beforeAll(async () => {
      const loginResponse = await agent
        .post("/users/login")
        .send({ email: "test@example.com", password: "password" });
      expect(loginResponse.status).toBe(200);
      token = loginResponse.body.accessToken;

      updateTestArticle = await prisma.article.create({
        data: {
          title: "Update Me",
          content: "This article will be updated",
          authorId: 1,
        },
      });
      deleteTestArticle = await prisma.article.create({
        data: {
          title: "Delete Me",
          content: "This article will be deleted",
          authorId: 1,
        },
      });
    });

    test("Article 생성", async () => {
      const response = await agent
        .post("/articles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Article",
          content: "This is a test article.",
        });
      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Test Article");
    });

    test("Article 수정", async () => {
      const response = await agent
        .patch(`/articles/${updateTestArticle.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Test Article",
          content: "This is an updated test article.",
        });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Test Article");
    });

    test("Article 삭제", async () => {
      const response = await agent
        .delete(`/articles/${deleteTestArticle.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(204);

      const deletedArticle = await prisma.article.findUnique({
        where: { id: deleteTestArticle.id },
      });
      expect(deletedArticle).toBeNull();
    });
  });
});
