process.env.NODE_ENV = 'development';

import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { hashPassword } from '../services/authService';

describe('인증 API 통합 테스트', () => {
  beforeEach(async () => {
    await prismaClient.$transaction([
      prismaClient.comment.deleteMany(),
      prismaClient.article.deleteMany(),
      prismaClient.product.deleteMany(),
      prismaClient.favorite.deleteMany(),
      prismaClient.like.deleteMany(),
      prismaClient.notification.deleteMany(),
      prismaClient.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'UDKthisPASSWORD',
    nickname: 'AuthTest',
    image: '',
  };

  it('회원가입에 성공할 수 있다', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.nickname).toBe(testUser.nickname);
  });

  it('로그인에 성공하면 access-token 쿠키를 반환한다', async () => {
    await prismaClient.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        nickname: testUser.nickname,
        image: '',
      },
    });

    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);

    const cookies = res.headers['set-cookie'];

    expect(Array.isArray(cookies)).toBe(true);

    if (!Array.isArray(cookies)) {
      throw new Error('set-cookie 응답이 배열이 아님');
    }

    const access = cookies.find((c) => c.includes('access-token'));
    const refresh = cookies.find((c) => c.includes('refresh-token'));

    expect(access).not.toBeUndefined();
    expect(refresh).not.toBeUndefined();
  });

  it('로그인한 유저가 토큰으로 인증된 요청을 보낼 수 있다 (예: 내 정보 조회)', async () => {
    await prismaClient.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        nickname: testUser.nickname,
        image: '',
      },
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const cookies = loginRes.headers['set-cookie'];

    const authRes = await request(app).get('/users/me').set('Cookie', cookies);

    expect(authRes.status).toBe(200);
    expect(authRes.body.email).toBe(testUser.email);
  });
});
