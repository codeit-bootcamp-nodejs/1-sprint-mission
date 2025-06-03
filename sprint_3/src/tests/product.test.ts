import request from "supertest";
import { app } from "../app";
import * as websocket from "../services/websocket";

jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));


jest.mock("../repositories/productRepository", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn().mockResolvedValue({
      id: 123,
      name: "수정된 제품",
      price: 20000,
      description: "수정된 설명",
      images: [],
      tags: [],
      authorId: 1,
    }),
  },
}));

jest.mock("../services/likeService", () => ({
  __esModule: true,
  default: {
    findByProductId: jest
      .fn()
      .mockResolvedValue([{ authorId: 1 }, { authorId: 2 }]),
  },
}));

jest.mock("../services/notificationService", () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockResolvedValue([
      { userId: 1, content: "관심을 표시한 상품의 가격이 변동되었습니다!" },
      { userId: 2, content: "관심을 표시한 상품의 가격이 변동되었습니다!" },
    ]),
  },
}));

import productService from "../services/productService";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /products - Mock 테스트", () => {
  test("모든 제품을 반환 Mock", async () => {
    const productRepository =
      require("../repositories/productRepository").default;
    productRepository.getAll.mockResolvedValue({
      products: [
        {
          id: 1,
          name: "Mock 제품 1",
          price: 10000,
          description: "설명입니다.",
          images: [],
          tags: [],
          authorId: 1,
        },
      ],
      totalCount: 1,
    });

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.products[0].name).toBe("Mock 제품 1");
    expect(productRepository.getAll).toHaveBeenCalled();
  });
});

describe("GET /products/:id - Mock 테스트", () => {
  test("특정 제품을 반환 Mock", async () => {
    const productRepository =
      require("../repositories/productRepository").default;
    productRepository.getById.mockResolvedValue({
      id: 1,
      name: "Mock 제품1",
      price: 10000,
      description: "설명입니다.",
      images: [],
      tags: [],
      authorId: 1,
    });

    const response = await request(app).get("/products/1");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Mock 제품1");
  });
});

describe("관심 상품에 좋아요를 누른 경우", () => {
  beforeEach(() => {
    const productRepository =
      require("../repositories/productRepository").default;

    productRepository.getAll.mockResolvedValue({
      products: [
        {
          id: 1,
          name: "제품1",
          price: 10000,
          description: "설명입니다.",
          images: [],
          tags: [],
          authorId: 1,
          isLiked: false,
        },
        {
          id: 101,
          name: "제품2",
          price: 10000,
          description: "설명입니다.",
          images: [],
          tags: [],
          authorId: 1,
          isLiked: true, // userId=1이 좋아요한 상품
        },
      ],
      totalCount: 2,
    });
  });

  test("userId=1이 productId=101 좋아요를 누른 상태인 경우", async () => {
    const response = await productService.getAll(1, 10, "recent", 1);

    expect(response.products.find((p) => p.id === 101)?.isLiked).toBe(true);
    expect(response.products.find((p) => p.id === 1)?.isLiked).toBe(false);
  });
});

describe("가격 변경 시 알림 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(websocket, "sendNotificationToUser")
      .mockImplementation(() => {});
  });

  test("가격이 바뀌면 알림이 전송된다", async () => {
    await productService.update(123, { price: 20000 });

    expect(websocket.sendNotificationToUser).toHaveBeenCalledTimes(2);
    expect(websocket.sendNotificationToUser).toHaveBeenCalledWith(
      1,
      "관심을 표시한 상품의 가격이 변동되었습니다!"
    );
    expect(websocket.sendNotificationToUser).toHaveBeenCalledWith(
      2,
      "관심을 표시한 상품의 가격이 변동되었습니다!"
    );
  });
});
