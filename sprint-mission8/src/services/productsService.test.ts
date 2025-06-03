import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

let agent: ReturnType<typeof request.agent>;

describe('비로그인 상태 - 상품 API 통합 테스트', () => {
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

  it('상품 목록을 조회할 수 있다', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.list)).toBe(true);
  });

  it('특정 상품을 조회할 수 있다', async () => {
    const user = await prismaClient.user.create({
      data: {
        email: `user_${Date.now()}@example.com`,
        password: 'UDKthisPASSWORD',
        nickname: 'Test',
        image: '',
      },
    });

    const product = await prismaClient.product.create({
      data: {
        name: 'test product',
        description: 'boring',
        price: 1000,
        tags: [],
        images: [],
        userId: user.id,
      },
    });

    const res = await request(app).get(`/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('test product');
  });
});

describe('로그인 상태 - 상품 API 통합 테스트', () => {
  let userId: number;

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

    agent = request.agent(app);

    const email = `productuser_${Date.now()}@test.com`;

    await agent.post('/auth/register').send({
      email,
      password: 'UDKthisPASSWORD',
      nickname: 'ProductUser',
      image: '',
    });

    await agent.post('/auth/login').send({
      email,
      password: 'UDKthisPASSWORD',
    });

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { email },
    });

    userId = user.id;
  });

  it('로그인한 사용자가 상품을 등록할 수 있다', async () => {
    const res = await agent.post('/products').send({
      name: 'New Product',
      description: 'desc',
      price: 1000,
      tags: ['a', 'b'],
      images: [],
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New Product');
  });

  it('로그인한 사용자가 본인 상품을 수정할 수 있다', async () => {
    const product = await prismaClient.product.create({
      data: {
        name: 'Old Product',
        description: 'desc',
        price: 1000,
        tags: [],
        images: [],
        userId,
      },
    });

    const res = await agent.patch(`/products/${product.id}`).send({
      name: 'Updated Product',
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Product');
  });

  it('로그인한 사용자가 본인 상품을 삭제할 수 있다', async () => {
    const product = await prismaClient.product.create({
      data: {
        name: 'Delete Me',
        description: 'desc',
        price: 1000,
        tags: [],
        images: [],
        userId,
      },
    });

    const res = await agent.delete(`/products/${product.id}`);
    expect(res.status).toBe(204);
  });
});
