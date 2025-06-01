import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('인증이 필요하지 않은 상품 API - 댓글 목록 조회', () => {
  const userData = {
    email: 'test@example.com',
    password: 'Password@1234',
    nickname: 'tester',
  };

  let productId: number;

  beforeEach(async () => {
    // 데이터 정리
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();

    // 유저 및 상품, 댓글 생성
    const user = await prismaClient.user.create({ data: userData });

    const product = await prismaClient.product.create({
      data: {
        name: '테스트 상품',
        description: '설명',
        price: 10000,
        tags: ['태그1', '태그2'],
        images: ['image1.jpg'],
        userId: user.id,
      },
    });

    productId = product.id;

    await prismaClient.comment.createMany({
      data: [
        { content: '댓글 1', productId: product.id, userId: user.id },
        { content: '댓글 2', productId: product.id, userId: user.id },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  test('상품에 등록된 댓글 목록을 조회할 수 있다', async () => {
    const res = await request(app).get(`/products/${productId}/comments`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.list)).toBe(true);
    expect(res.body.list.length).toBe(2);
  });

  test('존재하지 않는 상품 ID로 요청 시 404 에러 반환', async () => {
    const res = await request(app).get(`/products/99999/comments`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/product.*99999/);
  });
});
