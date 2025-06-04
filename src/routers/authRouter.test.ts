import request from 'supertest';
import { app } from '../app';
import { prismaClient } from '../lib/prismaClient';
import { hash } from 'bcrypt';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import { generateTokens } from '../lib/token';

describe('Auth 관련 테스트', () => {
  beforeEach(async () => {
    await prismaClient.user.deleteMany();

    const hashed = await hash('testpassword', 10);

    const testUser = await prismaClient.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        password: hashed,
        nickname: '테스트 유저',
      },
    });
  });
  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('POST /auth/register', () => {
    test('정상적인 회원가입 성공', async () => {
      const newUser = {
        email: 'testuser@example.com',
        password: 'Password123!',
        nickname: '테스트유저',
      };

      const response = await request(app).post('/auth/register').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.nickname).toBe(newUser.nickname);
      expect(response.body).not.toHaveProperty('password');
    });

    test('중복 이메일로 회원가입 시 400 반환', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'abc12345!',
        nickname: '중복유저',
      };

      await prismaClient.user.create({
        data: {
          email: 'testuser@example.com',
          password: await bcrypt.hash(userData.password, 10),
          nickname: '중복유저',
        },
      });

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exist');
    });
  });

  describe('POST /auth/login', () => {
    test('로그인 성공시 200 상태코드와 쿠키 반환', async () => {
      const testUser = await prismaClient.user.findUnique({ where: { email: 'test@example.com' } });
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser!.email, password: 'testpassword' });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^access-token=/),
          expect.stringMatching(/^refresh-token=/),
        ]),
      );
    });

    test('존재하지 않는 이메일로 로그인 시 400 상태코드 반환', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'no-user@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('틀린 비밀번호 입력 시 400  상태코드 반환', async () => {
      const testUser = await prismaClient.user.findUnique({ where: { email: 'test@example.com' } });
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser!.email, password: 'wrongpass123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  test('유효한 리프레시 토큰으로 토큰 재발급', async () => {
    const user = await prismaClient.user.create({
      data: {
        email: 'refresh@example.com',
        password: 'hashedpassword',
        nickname: '리프레시',
      },
    });

    const userId = user.id;
    const tokens = await generateTokens(userId);
    const refreshToken = tokens.refreshToken;

    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`]);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^access-token=/),
        expect.stringMatching(/^refresh-token=/),
      ]),
    );
  });

  test('쿠키에 토큰이 없을 경우 400', async () => {
    const response = await request(app).post('/auth/refresh');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  test('잘못된 토큰일 경우 400', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=invalid.token.here`]);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  test('로그인 시 access-token, refresh-token 쿠키가 설정되어야 함', async () => {
    const hashed = await hash('testpassword', 10);
    const rawPassword = 'testpassword';

    await prismaClient.user.create({
      data: {
        email: 'testmail@example.com',
        password: hashed,
        nickname: '테스트유저',
      },
    });

    const response = await request(app).post('/auth/login').send({
      email: 'testmail@example.com',
      password: rawPassword, // 평문
    });

    expect(response.status).toBe(200);
    const cookies = response.headers['set-cookie'];

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^access-token=/),
        expect.stringMatching(/^refresh-token=/),
      ]),
    );
  });
});
