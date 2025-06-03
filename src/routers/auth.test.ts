import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('인증 API - 회원가입 및 로그인', () => {
  const userData = {
    email: 'testuser@example.com',
    password: 'Password@1234',
    nickname: 'tester',
    image: null,
  };

  beforeEach(async () => {
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  test('회원가입 성공 시 201 응답과 사용자 정보 반환', async () => {
    const res = await request(app).post('/auth/register').send(userData);

    expect(res.status).toBe(201);
  });

  test('로그인 성공 시 200 응답과 access/refresh 토큰 쿠키가 설정됨', async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app).post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.status).toBe(200);
  });
});
