import request from "supertest";
import app from "./app";
import prisma from "./config/prisma";
import { Product } from "@prisma/client";
import { hashingPassword } from "./services/userService";

describe("Product 관련 통합 테스트'", () => {
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
  describe("인증이 필요없는 Product 요청", () => {
    describe("Product 목록조회_쿼리 파라미터 테스트", () => {
      beforeAll(async () => {
        await prisma.product.createMany({
          data: [
            {
              name: "First product",
              description: "Hello world",
              price: 100,
              authorId: 1,
              createdAt: new Date("2023-01-01T00:00:00.000Z"),
            },
            {
              name: "Second product",
              description: "Content about testing",
              price: 200,
              authorId: 1,
              createdAt: new Date("2023-01-02T00:00:00.000Z"),
            },
            {
              name: "Third product",
              description: "Search keyword appears here",
              price: 300,
              authorId: 1,
              createdAt: new Date("2023-01-03T00:00:00.000Z"),
            },
          ],
        });
      });

      test("쿼리 파라미터 없이 Product 목록 조회 테스트 ", async () => {
        const res = await request(app).get("/products");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
      test("쿼리 파라미터 limit=2 테스트", async () => {
        const response = await request(app).get("/products?limit=2");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
      });
      test("쿼리 파라미터 order=oldest 테스트", async () => {
        const response = await request(app).get("/products?order=oldest");
        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe("First product");
      });

      test("쿼리 파라미터 limit=2&offset=2&order=oldest 테스트", async () => {
        const full = await request(app).get("/products?order=oldest");
        const offset = await request(app).get(
          "/products?limit=2&offset=2&order=oldest"
        );

        expect(offset.status).toBe(200);
        expect(offset.body.length).toBeLessThanOrEqual(2);

        const expected = full.body.slice(2, 4);

        expect(offset.body).toEqual(expected); // 순서와 값까지 정확히 일치해야 함
      });
      test("쿼리 파라미터 search=Se 테스트", async () => {
        const response = await request(app).get("/products?search=Se");
        expect(response.status).toBe(200);
        for (const product of response.body) {
          const inName = product.name.includes("Se");
          const inDescription = product.description.includes("Se");
          expect(inName || inDescription).toBe(true);
        }
      });
    });
  });
  describe("인증이 필요한 Product 요청", () => {
    const agent = request.agent(app);
    let token: string;
    let updateTestProduct: Product;
    let deleteTestProduct: Product;

    beforeAll(async () => {
      const loginResponse = await agent
        .post("/users/login")
        .send({ email: "test@example.com", password: "password" });
      expect(loginResponse.status).toBe(200);
      token = loginResponse.body.accessToken;

      updateTestProduct = await prisma.product.create({
        data: {
          name: "Update Product",
          description: "This product will be updated",
          price: 1000,
          tags: ["electronics"],
          authorId: 1,
        },
      });

      deleteTestProduct = await prisma.product.create({
        data: {
          name: "Delete Product",
          description: "This product will be deleted",
          price: 2000,
          tags: ["appliances"],
          authorId: 1,
        },
      });
    });

    test("Product 생성", async () => {
      const response = await agent
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Product",
          description: "This is a test product.",
          price: 9999,
          tags: ["test", "sample"],
        });
      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Test Product");
    });

    test("Product 수정", async () => {
      const response = await agent
        .patch(`/products/${updateTestProduct.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Updated Product",
          description: "Updated product description.",
          price: 1234,
          tags: ["updated", "tag"],
        });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Product");
    });

    test("Product 삭제", async () => {
      const response = await agent
        .delete(`/products/${deleteTestProduct.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(204);

      const deletedProduct = await prisma.product.findUnique({
        where: { id: deleteTestProduct.id },
      });
      expect(deletedProduct).toBeNull();
    });
  });
});
