import request from 'supertest';
import { app } from '../app';
import { prismaClient } from '../lib/prismaClient';
import { hash } from 'bcrypt';
import * as cookie from 'cookie';
import * as socketService from '../services/SocketService';
import { getFavoriteList } from '../repositories/favoriteRepository';
import { createNotification } from '../services/notificationService';
import { generateTokens } from '../lib/token';
import { updateProductService } from '../services/productService';

describe('Proproduct 관련 테스트', () => {
  let token: string;

  beforeEach(async () => {
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();
    const hashed = await hash('testpassword', 10);

    await prismaClient.user.createMany({
      data: [
        { id: 1, email: 'test@example.com', password: hashed, nickname: '테스트 유저' },
        { id: 2, email: 'test2@example.com', password: hashed, nickname: '테스트 유저2' },
      ],
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

    await prismaClient.product.createMany({
      data: [
        {
          name: '테스트 상품1',
          description: '테스트 상품1 내용입니다',
          price: 10000,
          tags: ['테스트1 태그1', '테스트1 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-01'),
          userId: 1,
        },
        {
          name: '테스트 상품2',
          description: '테스트 상품2 내용입니다',
          price: 10000,
          tags: ['테스트2 태그1', '테스트2 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-02'),
          userId: 1,
        },
        {
          name: '새로운 상품3',
          description: '새로운 상품3 내용입니다',
          price: 10000,
          tags: ['새로운3 태그1', '새로운3 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-03'),
          userId: 1,
        },
        {
          name: '새로운 상품4',
          description: '새로운 상품4 내용입니다',
          price: 10000,
          tags: ['새로운4 태그1', '새로운4 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-04'),
          userId: 1,
        },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.favorite.deleteMany();
    await prismaClient.notification.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  describe('POST /products', () => {
    test('새로운 상품 생성', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        description: '새 상품 테스트 내용입니다',
        price: 10000,
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
        images: ['http://newtestimage.com'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.description).toBe(newProduct.description);
      expect(response.body.price).toBe(newProduct.price);
      expect(response.body.tags).toStrictEqual(newProduct.tags);
      expect(response.body.images).toStrictEqual(newProduct.images);
      expect(response.body.userId).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    test('제목이 빠졌을 때 400에러', async () => {
      const newProduct = {
        description: '새 상품 테스트 내용입니다',
        price: 10000,
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
        images: ['http://newtestimage.com'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(400);
    });

    test('설명이 빠졌을 때 400에러', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        price: 10000,
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
        images: ['http://newtestimage.com'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(400);
    });

    test('가격이 빠졌을 때 400에러', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        description: '새 상품 테스트 내용입니다',
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
        images: ['http://newtestimage.com'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(400);
    });

    test('태그가 빠졌을 때 400에러', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        description: '새 상품 테스트 내용입니다',
        price: 10000,
        images: ['http://newtestimage.com'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(400);
    });

    test('이미지가 빠졌을 때 400에러', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        description: '새 상품 테스트 내용입니다',
        price: 10000,
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
      };

      const response = await request(app)
        .post('/products')
        .set('Cookie', [`access-token=${token}`])
        .send(newProduct);

      expect(response.status).toBe(400);
    });

    test('로그인 인증되지 않은 상태로 등록 시 401에러 ', async () => {
      const newProduct = {
        name: '새 상품 테스트',
        description: '새 상품 테스트 내용입니다',
        price: 10000,
        tags: ['테스트 새 태그1', '테스트 새 태그2'],
        images: ['http://newtestimage.com'],
      };

      const response = await request(app).post('/products').send(newProduct);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /products', () => {
    test('상품이 없을 때 빈 배열 반환', async () => {
      await prismaClient.product.deleteMany();

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('모든 상품 리스트 조회', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].name).toBe('새로운 상품4');
      expect(response.body[1].name).toBe('새로운 상품3');
      expect(response.body[2].name).toBe('테스트 상품2');
      expect(response.body[3].name).toBe('테스트 상품1');
    });

    test(`키워드 필터링: '테스트' 포함된 상품 이름 조회 `, async () => {
      const response = await request(app).get('/products').query({ keyword: '테스트' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toContain('테스트');
      expect(response.body[1].name).toContain('테스트');
    });

    test('page=1, pageSize=2 로 제한된 개수만 조회', async () => {
      const response = await request(app).get('/products').query({ page: 1, pageSize: 2 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    test('page=2, pageSize=2 로 다음 페이지 조회', async () => {
      const response = await request(app).get('/products').query({ page: 2, pageSize: 2 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    test('sort=recent 파라미터에 따라 최신순으로 데이터를 정렬해서 조회 함', async () => {
      const response = await request(app).get('/products').query({ orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].name).toContain('새로운 상품4');
      expect(response.body[1].name).toContain('새로운 상품3');
      expect(response.body[2].name).toContain('테스트 상품2');
      expect(response.body[3].name).toContain('테스트 상품1');
    });

    test('복합 조건: keyword, pageSize, orderBy', async () => {
      const response = await request(app)
        .get('/products')
        .query({ keyword: '테스트', page: 1, pageSize: 1, orderBy: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toContain('테스트');
    });
  });

  describe('GET /products/:id', () => {
    test('id로 product 상세 조회', async () => {
      const newProduct = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-07'),
          userId: 1,
        },
      });
      const response = await request(app).get(`/products/${newProduct.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(newProduct.id);
    });

    test('존재하지 않은 id로 product 상세 조회', async () => {
      const nonExistId = 999;
      const response = await request(app).get(`/products/${nonExistId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${nonExistId} not found`);
    });
  });

  describe('PATCH /products/:id', () => {
    test('product의 모든 데이터를 업데이트 해야함', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-07'),
          userId: 1,
        },
      });

      const updateData = {
        name: '수정된 상품',
        description: '수정된 상품 내용입니다',
        price: 1000,
        tags: ['수정된 태그1', '수정된 태그2'],
        images: ['http://testimage.com'],
      };

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.tags).toStrictEqual(updateData.tags);
      expect(response.body.images).toStrictEqual(updateData.images);
    });

    test('상품을 부분적으로 업데이트 해야 함', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          userId: 1,
        },
      });

      const updateData = {
        name: '수정된 상품',
        description: '새로운 상품 내용입니다',
        price: 10000,
        tags: ['새로운 태그1', '새로운 태그2'],
        images: ['http://testimage.com'],
      };

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.tags).toStrictEqual(updateData.tags);
      expect(response.body.images).toStrictEqual(updateData.images);
    });

    test('존재하지 않는 ID에 대해서 404 반환', async () => {
      const nonExistId = 999;
      const updateData = {
        name: '수정된 상품',
        description: '새로운 상품 내용입니다',
        price: 10000,
        tags: ['새로운 태그1', '새로운 태그2'],
        images: ['http://testimage.com'],
      };

      const response = await request(app)
        .patch(`/products/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${nonExistId} not found`);
    });

    test('로그인 인증되지 않은 상태로 수정 시 401에러 ', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          createdAt: new Date('2025-01-07'),
          userId: 1,
        },
      });

      const updateData = {
        name: '수정된 상품',
        description: '수정된 상품 내용입니다',
        price: 1000,
        tags: ['수정된 태그1', '수정된 태그2'],
        images: ['http://testimage.com'],
      };

      const response = await request(app).patch(`/products/${product.id}`).send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /products/:id', () => {
    test('products 삭제함', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          userId: 1,
        },
      });

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(204);

      const deletedProduct = await prismaClient.product.findUnique({
        where: { id: product.id },
      });

      expect(deletedProduct).toBeNull();
    });

    test('존재하지 않는 ID에 대해 404를 반환해야 함', async () => {
      const nonExistId = 999;
      const response = await request(app)
        .delete(`/products/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${nonExistId} not found`);
    });

    test('로그인 인증되지 않은 상태로 삭제 시 401에러 ', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '새로운 상품',
          description: '새로운 상품 내용입니다',
          price: 10000,
          tags: ['새로운 태그1', '새로운 태그2'],
          images: ['http://testimage.com'],
          userId: 1,
        },
      });

      const response = await request(app).delete(`/products/${product.id}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('POST products/:id/comments', () => {
    test('상품에 댓글 작성하기', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const response = await request(app)
        .post(`/products/${product.id}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '새로운 댓글' });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('새로운 댓글');
      expect(response.body.productId).toBe(product.id);
      expect(response.body.userId).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    test('존재하지 않는 상품에 댓글을 달 경우 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .post(`/products/${nonExistId}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '존재하지 않은 상품' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${nonExistId} not found`);
    });

    test('댓글 내용이 없을 경우 400 반환', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글 테스트',
          description: '댓글 내용 테스트',
          price: 10000,
          tags: ['test'],
          images: ['http://testimage.com'],
          userId: 1,
        },
      });

      const response = await request(app)
        .post(`/products/${product.id}/comments`)
        .set('Cookie', [`access-token=${token}`])
        .send({});

      expect(response.status).toBe(400);
    });

    test('로그인하지 않은 상태로 댓글 작성 시 401 반환', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글 테스트',
          description: '댓글 내용 테스트',
          price: 10000,
          tags: ['test'],
          images: ['http://testimage.com'],
          userId: 1,
        },
      });

      const res = await request(app)
        .post(`/products/${product.id}/comments`)
        .send({ content: '비로그인 댓글' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /products/:id/comments', () => {
    test('상품 댓글 조회', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      await prismaClient.comment.createMany({
        data: [
          { content: '댓글 내용1', productId: product.id, userId: 1 },
          { content: '댓글 내용2', productId: product.id, userId: 1 },
          { content: '댓글 내용3', productId: product.id, userId: 1 },
        ],
      });

      const response = await request(app).get(`/products/${product.id}/comments`);

      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(3);
    });

    test('cursor 기반 페이지네이션이 작동', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      await prismaClient.comment.createMany({
        data: [
          { content: '댓글 내용1', productId: product.id, userId: 1 },
          { content: '댓글 내용2', productId: product.id, userId: 1 },
          { content: '댓글 내용3', productId: product.id, userId: 1 },
        ],
      });

      const firstResponse = await request(app)
        .get(`/products/${product.id}/comments`)
        .query({ limit: 2 });
      const nextCursor = firstResponse.body.nextCursor;

      const secondResponse = await request(app)
        .get(`/products/${product.id}/comments`)
        .query({ limit: 2, cursor: `${nextCursor}` });

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.list.length).toBe(2);
      expect(secondResponse.body.nextCursor).toBe(nextCursor + 1);
    });

    test('댓글이 없을 때 빈 배열을 반환해야 한다', async () => {
      await prismaClient.comment.deleteMany();

      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const response = await request(app).get(`/products/${product.id}/comments`);
      expect(response.status).toBe(200);
      expect(response.body.list).toEqual([]);
    });

    test('존재하지 않는 productId에 대해 404를 반환해야 한다', async () => {
      const nonExistId = 999;
      const response = await request(app).get(`/products/${nonExistId}/comments`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${nonExistId} not found`);
    });
  });

  describe('PATCH /comments/:id', () => {
    test('상품 댓글 수정 성공', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '상품 댓글 내용', productId: product.id, userId: 1 },
      });

      const updateData = { content: '수정된 상품 댓글' };

      const response = await request(app)
        .patch(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe(updateData.content);
    });

    test('빈 내용으로 상품 댓글 수정시 400 에러', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '상품 댓글 내용', productId: product.id, userId: 1 },
      });

      const response = await request(app)
        .patch(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`])
        .send({});

      expect(response.status).toBe(400);
    });

    test('존재하지 않는 상품 댓글 ID일 경우 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .patch(`/comments/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`])
        .send({ content: '존재하지 않은 상품 댓글 ID' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Comment with id ${nonExistId} not found`);
    });

    test('로그인하지 않은 상태로 댓글 수정 시 401 반환', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '상품 댓글 내용', productId: product.id, userId: 1 },
      });

      const updateData = { content: '수정된 상품 댓글' };

      const response = await request(app).patch(`/comments/${comment.id}`).send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('DELETE /comments/:id', () => {
    test('상품 댓글 삭제 성공', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '상품 댓글 내용', productId: product.id, userId: 1 },
      });

      const response = await request(app)
        .delete(`/comments/${comment.id}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(204);
    });

    test('존재하지 않는 상품 댓글 삭제 시 404 반환', async () => {
      const nonExistId = 999;

      const response = await request(app)
        .delete(`/comments/${nonExistId}`)
        .set('Cookie', [`access-token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Comment with id ${nonExistId} not found`);
    });

    test('로그인하지 않은 상태로 댓글 삭제 시 401 반환', async () => {
      const product = await prismaClient.product.create({
        data: {
          name: '댓글용 상품',
          description: '설명',
          price: 10000,
          tags: ['test'],
          images: ['http://img.com'],
          userId: 1,
        },
      });

      const comment = await prismaClient.comment.create({
        data: { content: '상품 댓글 내용', productId: product.id, userId: 1 },
      });

      const response = await request(app).delete(`/comments/${comment.id}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('createNotification', () => {
    test('존재하는 유저에게 알림을 생성하면 DB에 저장된다', async () => {
      await prismaClient.product.deleteMany();
      await prismaClient.notification.deleteMany();
      await prismaClient.user.deleteMany();

      const user = await prismaClient.user.create({
        data: {
          email: 'notify@test.com',
          password: 'secure',
          nickname: '테스트유저',
        },
      });

      const payload = {
        productId: 123,
        newPrice: 20000,
        oldPrice: 10000,
      };

      const notification = await createNotification({
        userId: user.id,
        type: 'PRICE_CHANGED',
        payload,
      });

      expect(notification).toBeDefined();
      expect(notification.userId).toBe(user.id);
      expect(notification.type).toBe('PRICE_CHANGED');
      expect(notification.read).toBe(false);

      const payloadObj =
        typeof notification.payload === 'string'
          ? JSON.parse(notification.payload)
          : notification.payload;

      expect(payloadObj.newPrice).toBe(20000);
    });

    test('존재하지 않는 유저에게 알림을 생성하면 오류 발생', async () => {
      const nonExistId = 999;
      const payload = {
        message: '유저 없음',
      };

      await expect(
        createNotification({
          userId: nonExistId,
          type: 'NEW_COMMENT',
          payload,
        }),
      ).rejects.toThrow(`User with id ${nonExistId} not found`);
    });
  });
});
