import request from "supertest";
import app from "./app";
import prisma from "./config/prisma";
import { Product } from "@prisma/client";
import { hashingPassword } from "./services/userService";

describe("User 관련 통합 테스트'", () => {
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

  test("회원가입", async () => {
    const res = await request(app).post("/users").send({
      email: "test2@example.com",
      nickname: "test2",
      password: "password",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("nickname");
    expect(res.body).toHaveProperty("image");
  });
  test("회원가입_이미 존재하는 이메일", async () => {
    const res = await request(app).post("/users").send({
      email: "test@example.com",
      nickname: "test",
      password: "password",
    });
    expect(res.status).toBe(500);
  });
});
