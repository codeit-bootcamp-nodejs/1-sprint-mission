import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';

let agent: ReturnType<typeof request.agent>;

describe('비로그인 상태 - 게시글 API 통합 테스트', () => {
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

  it('게시글 목록을 조회할 수 있다', async () => {
    const res = await request(app).get('/articles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.list)).toBe(true);
  });

  it('특정 게시글을 조회할 수 있다', async () => {
    const user = await prismaClient.user.create({
      data: {
        email: 'articleTestUser@test.com',
        password: 'UDKthisPASSWORD',
        nickname: 'Test',
        image: '',
      },
    });

    const article = await prismaClient.article.create({
      data: {
        title: 'Test title',
        content: 'Test content',
        image: null,
        userId: user.id,
      },
    });

    const res = await request(app).get(`/articles/${article.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test title');
  });
});

describe('로그인 상태 - 게시글 API 통합 테스트', () => {
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

    const uniqueEmail = `loginuser_${Date.now()}@test.com`;

    // 🔧 회원가입 시 image 필드 포함
    const registerRes = await agent.post('/auth/register').send({
      email: uniqueEmail,
      password: 'UDKthisPASSWORD',
      nickname: 'Author',
      image: '',
    });

    const user = await prismaClient.user.findUnique({
      where: { email: uniqueEmail },
    });
    if (!user) throw new Error('User not found after registration');
    userId = user.id;

    const loginRes = await agent.post('/auth/login').send({
      email: uniqueEmail,
      password: 'UDKthisPASSWORD',
    });
  });

  it('로그인한 사용자가 게시글을 생성할 수 있다', async () => {
    const res = await agent.post('/articles').send({
      title: 'New Article',
      content: 'Some content',
      image: '',
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Article');
  });

  it('비로그인 사용자는 게시글을 생성할 수 없다', async () => {
    const res = await request(app).post('/articles').send({
      title: 'Should Fail',
      content: 'No auth',
      image: '',
    });

    expect(res.status).toBe(401);
  });

  it('로그인한 사용자가 본인 게시글을 수정할 수 있다', async () => {
    const article = await prismaClient.article.create({
      data: {
        title: 'Original Title',
        content: 'Original Content',
        image: null,
        userId,
      },
    });

    const res = await agent.patch(`/articles/${article.id}`).send({
      title: 'Updated Title',
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('다른 사용자는 게시글을 수정할 수 없다', async () => {
    const article = await prismaClient.article.create({
      data: {
        title: 'Other User Article',
        content: 'Original Content',
        image: null,
        userId,
      },
    });

    const otherAgent = request.agent(app);
    const email = `other_${Date.now()}@test.com`;

    await otherAgent.post('/auth/register').send({
      email,
      password: 'password',
      nickname: 'Other',
      image: '',
    });

    await otherAgent.post('/auth/login').send({
      email,
      password: 'password',
    });

    const res = await otherAgent.patch(`/articles/${article.id}`).send({
      title: 'Hacked',
    });

    expect(res.status).toBe(403);
  });

  it('로그인한 사용자가 본인 게시글을 삭제할 수 있다', async () => {
    const article = await prismaClient.article.create({
      data: {
        title: 'To be deleted',
        content: 'Temp',
        image: null,
        userId,
      },
    });

    const res = await agent.delete(`/articles/${article.id}`);
    expect(res.status).toBe(204);
  });

  it('다른 사용자는 게시글을 삭제할 수 없다', async () => {
    const article = await prismaClient.article.create({
      data: {
        title: 'Other Article',
        content: 'Temp',
        image: null,
        userId,
      },
    });

    const hackerAgent = request.agent(app);
    const email = `hacker_${Date.now()}@test.com`;

    await hackerAgent.post('/auth/register').send({
      email,
      password: 'password',
      nickname: 'Hacker',
      image: '',
    });

    await hackerAgent.post('/auth/login').send({
      email,
      password: 'password',
    });

    const res = await hackerAgent.delete(`/articles/${article.id}`);
    expect(res.status).toBe(403);
  });
});
