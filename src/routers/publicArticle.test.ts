import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

describe('인증이 필요하지 않은 게시글 API - 댓글 목록 조회', () => {
  const userData = {
    email: 'articleuser@example.com',
    password: 'Password@1234',
    nickname: 'articleTester',
  };

  let articleId: number;

  beforeEach(async () => {
    // 데이터 초기화
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();

    // 유저 생성
    const user = await prismaClient.user.create({ data: userData });

    // 게시글 생성
    const article = await prismaClient.article.create({
      data: {
        title: '테스트 게시글',
        content: '내용입니다',
        image: 'image.jpg',
        userId: user.id,
      },
    });

    articleId = article.id;

    // 댓글 생성
    await prismaClient.comment.createMany({
      data: [
        { content: '댓글 A', articleId: article.id, userId: user.id },
        { content: '댓글 B', articleId: article.id, userId: user.id },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  test('게시글에 등록된 댓글 목록을 조회할 수 있다', async () => {
    const res = await request(app).get(`/articles/${articleId}/comments`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.list)).toBe(true);
    expect(res.body.list.length).toBe(2);
  });

  test('존재하지 않는 게시글 ID로 요청 시 404 에러 반환', async () => {
    const res = await request(app).get(`/articles/99999/comments`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/article.*99999/);
  });
});
