import request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient';

describe('인증이 필요한 article 관련 테스트', () => {
  // 생성할 유저 정보
  const email = 'article@example.com';
  const password = 'Password@1234';
  const passwordHashed = bcrypt.hashSync(password, 10);
  // 각 테스트 실행 전 데이터베이스 정리
  beforeEach(async () => {
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();
  });

  // 모든 테스트 완료 후 연결 정리
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /articles', () => {
    test('게시글 등록', async () => {
      const user = await prismaClient.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: 'user',
        },
      });
      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = {
        title: '테스트 입니다.',
        content: '테스트 게시글입니다.',
        image: null,
      };

      const response = await agent.post('/articles').send(article);
      console.log('응답 바디:', response.body);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('테스트 입니다.');
      expect(response.body.content).toBe('테스트 게시글입니다.');
      expect(response.body.id).toBeDefined();
    });
  });

  describe('PATCH /articles/:id', () => {
    test('게시글 수정', async () => {
      const user = await prismaClient.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: 'user',
        },
      });

      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = await prismaClient.article.create({
        data: {
          title: '테스트 입니다.',
          content: '테스트 게시글입니다.',
          userId: user.id,
        },
      });

      const update = {
        title: '테스트 2',
      };

      const response = await agent.patch(`/articles/${article.id}`).send(update);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('테스트 2');
    });
  });

  describe('DELETE /articles/:id', () => {
    test('게시글 삭제', async () => {
      const user = await prismaClient.user.create({
        data: {
          email,
          password: passwordHashed,
          nickname: 'user',
        },
      });

      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({
        email,
        password,
      });
      expect(login.status).toBe(200);

      const article = await prismaClient.article.create({
        data: {
          title: '테스트 입니다.',
          content: '테스트 게시글입니다.',
          userId: user.id,
        },
      });

      const response = await agent.delete(`/articles/${article.id}`).send();
      expect(response.status).toBe(204);
    });
  });
});
