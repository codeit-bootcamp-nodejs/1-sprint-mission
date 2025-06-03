import request from "supertest";
import { app } from "../app";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";

describe("회원 가입, 로그인 테스트", () => {
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

  describe("POST/users", () => {
    test("회원가입", async () => {
      const email = "test7@test.com"
      const response = await request(app).post("/users").send({
        email,
        nickname: "user1",
        password,
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nickname", "user1");
    });

    test("로그인", async () => {
      const email = "test8@test.com"
      const user1 = await prisma.user.create({
        data: {
          email,
          nickname: "user1",
          password: passwordHashed,
        },
      });

      const response = await request(app).post("/users/login").send({
        email,
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
  });
});
