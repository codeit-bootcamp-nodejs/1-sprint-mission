import request from 'supertest';
import app from '../app';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient';

describe('인증이 필요한 product 관련 테스트', () => {
  const email = 'product@example.com';
  const password = 'Password@1234';
  const passwordHashed = bcrypt.hashSync(password, 10);

  beforeEach(async () => {
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /products', () => {
    test('상품 등록', async () => {
      const user = await prismaClient.user.create({
        data: { email, password: passwordHashed, nickname: 'user' },
      });

      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({ email, password });
      expect(login.status).toBe(200);

      const product = {
        name: '맥북',
        description: '최신형 맥북입니다.',
        price: 2500000,
        tags: ['전자기기', '애플'],
        images: ['image1.jpg', 'image2.jpg'],
      };

      const response = await agent.post('/products').send(product);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('맥북');
      expect(response.body.description).toBe('최신형 맥북입니다.');
      expect(response.body.price).toBe(2500000);
      expect(response.body.id).toBeDefined();
    });
  });

  describe('PATCH /products/:id', () => {
    test('상품 수정', async () => {
      const user = await prismaClient.user.create({
        data: { email, password: passwordHashed, nickname: 'user' },
      });

      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({ email, password });
      expect(login.status).toBe(200);

      const product = await prismaClient.product.create({
        data: {
          name: '맥북',
          description: '최신형 맥북입니다.',
          price: 2500000,
          tags: ['전자기기'],
          images: ['image.jpg'],
          userId: user.id,
        },
      });

      const update = {
        name: '맥북 프로',
        price: 3000000,
      };

      const response = await agent.patch(`/products/${product.id}`).send(update);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('맥북 프로');
      expect(response.body.price).toBe(3000000);
    });
  });

  describe('DELETE /products/:id', () => {
    test('상품 삭제', async () => {
      const user = await prismaClient.user.create({
        data: { email, password: passwordHashed, nickname: 'user' },
      });

      const agent = request.agent(app);
      const login = await agent.post('/auth/login').send({ email, password });
      expect(login.status).toBe(200);

      const product = await prismaClient.product.create({
        data: {
          name: '맥북',
          description: '최신형 맥북입니다.',
          price: 2500000,
          tags: ['전자기기'],
          images: ['image.jpg'],
          userId: user.id,
        },
      });

      const response = await agent.delete(`/products/${product.id}`).send();
      expect(response.status).toBe(204);
    });
  });
});
