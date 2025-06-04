import request from "supertest";
import app from "../../src/main";
import prismaClient from "../../src/lib/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import { REFRESH_TOKEN_COOKIE_NAME } from "../../src/lib/constants";

describe("Auth API 통합 테스트", () => {
  let user: any;
  beforeEach(async () => {
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password1", 10);

    user = await prismaClient.user.create({
      data: {
        email: "usertest@example.com",
        password: hashedPassword,
        nickname: "닉네임test",
      },
    });
  });
  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  describe("POST /auth/login", () => {
    test("로그인 성공 시 200을 반환해야 함.", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "usertest@example.com", password: "password1" });
      expect(response.status).toBe(200);
    });
  });

  describe("POST /auth/login", () => {
    test("로그아웃 시 200을 반환해야 함.", async () => {
      const response = await request(app).post("/auth/logout");
      expect(response.status).toBe(200);
    });
  });

  describe("POST /auth/login", () => {
    test("회원가입 성공 시 201과 유저정보를 반환해야 함.", async () => {
      const newUser = {
        email: "newUser@example.com",
        password: "password1",
        nickname: "테스트용 유저1",
        image: "",
      };
      const response = await request(app).post("/auth/register").send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.email).toBe("newUser@example.com");
      expect(response.body.image).toBe("");
      expect(typeof response.body.id).toBe("number");
    });
  });

  describe("POST /auth/refresh", () => {
    test("토큰 재발급 성공시 200을 반환해야 함.", async () => {
      const testRefreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
      );
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${testRefreshToken}`]);
      expect(response.status).toBe(200);
    });
  });
});
