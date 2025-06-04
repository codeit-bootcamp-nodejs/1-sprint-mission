import request from 'supertest';
import { app } from '../app';
import { prismaClient } from '../lib/prismaClient';
import { hash } from 'bcrypt';
import * as cookie from 'cookie';

describe('Article 관련 테스트', () => {
  let token: string;

  beforeEach(async () => {
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();

    const hashed = await hash('testpassword', 10);

    await prismaClient.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        password: hashed,
        nickname: '테스트 유저',
      },
    });

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'testpassword',
    });

    const setCookieHeader = res.headers['set-cookie'][0];

    const parsedCookie = cookie.parse(setCookieHeader);
    if (!parsedCookie['access-token']) {
      throw new Error('Access token not found in cookies');
    }
    token = parsedCookie['access-token'] as string;

    await prismaClient.article.createMany({
      data: [
        {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
        {
          title: '테스트 아티클 2',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-02'),
        },
        {
          title: '새로운 아티클 3',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-03'),
        },
        {
          title: '새로운 아티클 4',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-04'),
        },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('POST /articles', () => {
    test('새로운 아티클 생성', async () => {
      const newArticle = {
        title: '테스트 제목',
        content: '테스트 내용',
        image: 'http://imagetest.com',
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [`access-token=${token}`])
        .send(newArticle);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newArticle.title);
      expect(response.body.content).toBe(newArticle.content);
      expect(response.body.userId).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    test('제목이 빠졌을 때 400 에러', async () => {
      const newArticle = {
        content: '테스트 내용',
        image: 'http://imagetest.com',
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [`access-token=${token}`])
        .send(newArticle);

      expect(response.status).toBe(400);
    });

    test('내용이 빠졌을 때 400 에러', async () => {
      const newArticle = {
        title: '테스트 제목',
        image: 'http://imagetest.com',
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [`access-token=${token}`])
        .send(newArticle);

      expect(response.status).toBe(400);
    });

    test('이미지가 없어도 상태코드 200출력 ', async () => {
      const newArticle = {
        title: '테스트 제목',
        content: '테스트 내용',
        image: null,
      };

      const response = await request(app)
        .post('/articles')
        .set('Cookie', [`access-token=${token}`])
        .send(newArticle);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newArticle.title);
      expect(response.body.content).toBe(newArticle.content);
      expect(response.body.userId).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    test('로그인 인증되지 않은 상태로 등록시 401에러 ', async () => {
      const newArticle = {
        title: '테스트 제목',
        content: '테스트 내용',
        image: 'http://imagetest.com',
      };

      const response = await request(app).post('/articles').send(newArticle);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /articles', () => {
    test('아티클이 없을 때 빈 배열 반환', async () => {
      await prismaClient.article.deleteMany();

      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('모든 아티클 리스트 조회', async () => {
      const response = await request(app).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].title).toBe('새로운 아티클 4');
      expect(response.body[1].title).toBe('새로운 아티클 3');
    });

    test(`키워드 필터링: '테스트' 포함된 타이틀 조회`, async () => {
      const response = await request(app).get('/articles').query({ keyword: '테스트' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toContain('테스트 아티클');
      expect(response.body[1].title).toContain('테스트 아티클');
    });

    test('page=1, pageSize=2 로 제한된 개수만 조회', async () => {
      const response = await request(app).get('/articles').query({ page: 1, pageSize: 2 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    test('page=2, pageSize=2 로 다음 페이지 조회', async () => {
      const response = await request(app).get('/articles').query({ page: 2, pageSize: 2 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    test('sort=recent 파라미터에 따라 최신순으로 데이터를 정렬해서 조회 함', async () => {
      const response = await request(app).get('/articles').query({ orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].title).toContain('새로운 아티클 4');
      expect(response.body[1].title).toContain('새로운 아티클 3');
    });

    test('복합 조건: keyword, pageSize, orderBy', async () => {
      const response = await request(app)
        .get('/articles')
        .query({ keyword: '테스트', page: 1, pageSize: 1, orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toContain('테스트');
    });
  });

  describe('GET /articles/:id', () => {
    test('id로 article 상세 조회', async () => {
      const newArticle = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: 'http://imagetest.com',
          userId: 1,
        },
      });
      const response = await request(app).get(`/articles/${newArticle.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(newArticle.id);
    });

    test('존재하지 않은 id로 article 상세 조회 404', async () => {
      const nonExistId = 999;
      const response = await request(app).get(`/articles/${nonExistId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${nonExistId} not found`);
    });
  });

  describe('PATCH /articles/:id', () => {
    test('article의 모든 데이터를 업데이트 해야함', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: '',
          userId: 1,
        },
      });

      const updateData = {
        title: '수정된 제목',
        content: '수정된 내용',
        image: 'http://updatedImage.com',
      };

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(article.id);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
      expect(response.body.image).toBe(updateData.image);
    });

    test('아티클을 부분적으로 업데이트 해야 함', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: '',
          userId: 1,
        },
      });

      const updateData = {
        title: '수정된 제목',
      };

      const response = await request(app)
        .patch(`/articles/${article.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(article.id);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(article.content);
      expect(response.body.image).toBe(article.image);
    });

    test('존재하지 않는 ID에 대해서 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .patch(`/articles/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`])
        .send({ title: '수정된 제목', content: '테스트 내용', image: '' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${nonExistId} not found`);
    });

    test('로그인 인증되지 않은 상태 수정 401에러 ', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: '',
          userId: 1,
        },
      });

      const updateData = {
        title: '수정된 제목',
      };

      const response = await request(app).patch(`/articles/${article.id}`).send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /articles/:id', () => {
    test('articles 삭제함', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: '',
          userId: 1,
        },
      });

      const response = await request(app)
        .delete(`/articles/${article.id}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(204);

      const deletedArticle = await prismaClient.article.findUnique({
        where: { id: article.id },
      });

      expect(deletedArticle).toBeNull();
    });

    test('존재하지 않는 ID에 대해 404를 반환해야 함', async () => {
      const nonExistId = 999;
      const response = await request(app)
        .delete(`/articles/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${nonExistId} not found`);
    });

    test('로그인 인증되지 않은 상태로 삭제시 401에러 ', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          image: '',
          userId: 1,
        },
      });

      const response = await request(app).delete(`/articles/${article.id}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('POST articles/:id/comments', () => {
    test('아티클에 댓글 작성하기', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '새로운 댓글' });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('새로운 댓글');
      expect(response.body.articleId).toBe(article.id);
      expect(response.body.userId).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    test('존재하지 않는 아티클에 댓글을 달 경우 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .post(`/articles/${nonExistId}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '존재하지 않은 아티클' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${nonExistId} not found`);
    });

    test('댓글 내용이 없을 경우 400 반환', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({});

      expect(response.status).toBe(400);
    });

    test('로그인하지 않은 상태로 댓글 작성 시 401 반환', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const response = await request(app)
        .post(`/articles/${article.id}/comments`)
        .send({ content: '비로그인 댓글' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /articles/:id/comments', () => {
    test('아티클 댓글 조회', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      await prismaClient.comment.createMany({
        data: [
          { content: '댓글 내용1', articleId: article.id, userId: 1 },
          { content: '댓글 내용2', articleId: article.id, userId: 1 },
          { content: '댓글 내용3', articleId: article.id, userId: 1 },
        ],
      });

      const response = await request(app).get(`/articles/${article.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(3);
    });

    test('cursor 기반 페이지네이션이 작동', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      await prismaClient.comment.createMany({
        data: [
          { content: '댓글 내용1', articleId: article.id, userId: 1 },
          { content: '댓글 내용2', articleId: article.id, userId: 1 },
          { content: '댓글 내용3', articleId: article.id, userId: 1 },
        ],
      });

      const firstResponse = await request(app)
        .get(`/articles/${article.id}/comments`)
        .query({ limit: 2 });
      const nextCursor = firstResponse.body.nextCursor;

      const secondResponse = await request(app)
        .get(`/articles/${article.id}/comments`)
        .query({ limit: 2, cursor: `${nextCursor}` });

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.list.length).toBe(2);
      expect(secondResponse.body.nextCursor).toBe(nextCursor + 1);
    });

    test('댓글이 없을 때 빈 배열을 반환해야 한다', async () => {
      await prismaClient.comment.deleteMany();

      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const response = await request(app).get(`/articles/${article.id}/comments`);
      expect(response.status).toBe(200);
      expect(response.body.list).toEqual([]);
    });

    test('존재하지 않는 articleId에 대해 404를 반환해야 한다', async () => {
      const nonExistId = 999;
      const response = await request(app).get(`/articles/${nonExistId}/comments`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${nonExistId} not found`);
    });
  });

  describe('PATCH /comments/:id', () => {
    test('아티클 댓글 수정 성공', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '아티클 댓글 내용', articleId: article.id, userId: 1 },
      });

      const updateData = { content: '수정된 아티클 댓글' };

      const response = await request(app)
        .patch(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe(updateData.content);
    });

    test('빈 내용으로 아티클 댓글 수정시 400 에러', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '아티클 댓글 내용', articleId: article.id, userId: 1 },
      });

      const response = await request(app)
        .patch(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send({});

      expect(response.status).toBe(400);
    });

    test('존재하지 않는 아티클 댓글 ID일 경우 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .patch(`/comments/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '존재하지 않은 아티클 댓글 ID' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Comment with id ${nonExistId} not found`);
    });

    test('로그인하지 않은 상태로 댓글 수정 시 401 반환', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '아티클 댓글 내용', articleId: article.id, userId: 1 },
      });

      const updateData = { content: '수정된 아티클 댓글' };

      const response = await request(app).patch(`/comments/${comment.id}`).send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /comments/:id', () => {
    test('아티클 댓글 삭제 성공', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '아티클 댓글 내용', articleId: article.id, userId: 1 },
      });

      const response = await request(app)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(204);
    });

    test('존재하지 않는 아티클 댓글 삭제 시 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .delete(`/comments/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Comment with id ${nonExistId} not found`);
    });

    test('로그인하지 않은 상태로 댓글 삭제 시 401 반환', async () => {
      const article = await prismaClient.article.create({
        data: {
          title: '테스트 아티클 1',
          content: '내용',
          image: '',
          userId: 1,
          createdAt: new Date('2025-01-01'),
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '아티클 댓글 내용', articleId: article.id, userId: 1 },
      });

      const response = await request(app).delete(`/comments/${comment.id}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});
