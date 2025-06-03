import request from "supertest";
import { app } from "../../app";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";

describe("인증이 필요없는 product 관련 테스트", () => {
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

  describe("GET/products", () => {
    test("제품이 없을 때는 빈 배열을 반환", async () => {
      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ products: [], totalCount: 0 });
    });

    test("모든 등록된 제품을 반환", async () => {
      const email = "test9@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const product1 = await prisma.product.create({
        data: {
          name: "제품1",
          description: "제품입니다.",
          price: 20000,
          images: ["http://www.naver.com/1111"],
          tags: ["tag1", "tag2"],
          authorId: user.id,
        },
      });

      const product2 = await prisma.product.create({
        data: {
          name: "제품2",
          description: "제품입니다.",
          price: 20000,
          images: ["http://www.naver.com/2222"],
          tags: ["tag3", "tag4"],
          authorId: user.id,
        },
      });

      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);
      expect(response.body.products[0].name).toBe("제품2");
      expect(response.body.products[1].name).toBe("제품1");
    });

    test("query 조회", async () => {
      const email = "test9@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const product1 = await prisma.product.create({
        data: {
          name: "제품1",
          description: "제품입니다.",
          price: 20000,
          images: ["http://www.naver.com/1111"],
          tags: ["tag1", "tag2"],
          authorId: user.id,
        },
      });

      const product2 = await prisma.product.create({
        data: {
          name: "제품2",
          description: "제품입니다.",
          price: 20000,
          images: ["http://www.naver.com/2222"],
          tags: ["tag3", "tag4"],
          authorId: user.id,
        },
      });

      const response = await request(app).get(
        "/products?page=1&pageSize=10&orderBy=asc&search=제품2"
      );

      expect(response.status).toBe(200);
      expect(response.body.products[0].name).toBe("제품2");
    });
  });

  describe("GET/products/:id", () => {
    test("특정 제품을 조회", async () => {
      const email = "test10@test.com";
      const user = await prisma.user.create({
        data: { email, password: passwordHashed, nickname: "user" },
      });

      const product2 = await prisma.product.create({
        data: {
          name: "제품2",
          description: "제품입니다.",
          price: 20000,
          images: ["http://www.naver.com/2222"],
          tags: ["tag3", "tag4"],
          authorId: user.id,
        },
      });

      const response = await request(app).get(`/products/${product2.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "제품2");
      expect(response.body).toHaveProperty("id", product2.id);
    });
  });

  test("존재하지 않을 경우 404 반환", async () => {
    const response = await request(app).get("/products/100");

    expect(response.status).toBe(404);
  });
});
