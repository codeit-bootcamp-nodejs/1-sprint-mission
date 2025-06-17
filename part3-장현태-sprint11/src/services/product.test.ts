import productRepo from "../repositories/productRepository";
import * as productService from "./productService";
import * as socketService from "./socketService";

describe("Product Service 유닛 테스트", () => {
  jest.mock("../services/socketService", () => ({
    emitNotification: jest.fn(),
  }));

  describe("updateProductById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const fakeExistingProduct = {
      id: "p1",
      name: "Fake Product",
      description: "desc",
      price: 1000,
      tags: ["t1"],
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 1,
      like: [
        {
          id: 1,
          userId: 42,
          productId: "p1",
          articleId: null,
          user: { id: 42 },
        },
      ],
    };

    it("상품을 정상적으로 수정하고 알림을 발송한다", async () => {
      const existingProductCheckingSpy = jest
        .spyOn(productRepo, "getById")
        .mockResolvedValue(fakeExistingProduct);
      const updateSpy = jest
        .spyOn(productRepo, "update")
        .mockResolvedValue({ ...fakeExistingProduct, price: 2000 });

      const emitSpy = jest.spyOn(socketService, "emitNotification");
      const updated = await productService.updateProductById("abc123", {
        name: "Updated",
        description: "Updated desc",
        price: 2000,
        tags: [],
      });

      expect(existingProductCheckingSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
      expect(updated.price).toBe(2000);
      expect(emitSpy).toHaveBeenCalledWith(42, {
        message: "Price changed 1000 to 2000",
        type: "product price changed",
      });
    });

    it("없는 상품이면 예외를 던진다", async () => {
      jest.spyOn(productRepo, "getById").mockResolvedValue(null);

      await expect(
        productService.updateProductById("no-id", {
          name: "X",
          description: "X",
          price: 100,
          tags: [],
        })
      ).rejects.toThrow("Product not found");
    });
  });

  describe("유저가 현재 Product를 좋아요했는지 검사하는 서비스 테스트", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const getAllLikedProductSpy = jest
      .spyOn(productRepo, "getAllLikedProduct")
      .mockImplementation((userId) => {
        if (userId === "42") return Promise.resolve([fakeLikedProduct]);
        return Promise.resolve([]); // 좋아요 안 한 경우
      });
    const fakeLikedProduct = {
      id: "abc123",
      name: "Test Product",
      description: "A test product",
      price: 1000,
      tags: ["tag1", "tag2"],
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 1,
      like: [
        {
          id: 1,
          userId: 42, // 이 userId가 테스트 대상
          productId: "abc123",
          articleId: null,
          user: {
            id: 42,
            name: "Tester",
            email: "tester@example.com",
          },
        },
        {
          id: 2,
          userId: 99,
          productId: "abc123",
          articleId: null,
          user: {
            id: 99,
            name: "AnotherUser",
            email: "another@example.com",
          },
        },
      ],
    };
    it("Id가 42 번인 유저가 FakeProduct를 Like했는지 테스트 (True)", async () => {
      const result = await productService.checkIsLikedByUser(
        "42",
        fakeLikedProduct.id
      );
      expect(getAllLikedProductSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("Id가 100 번인 유저가 FakeProduct를 Like했는지 테스트 (False)", async () => {
      const result = await productService.checkIsLikedByUser(
        "100",
        fakeLikedProduct.id
      );
      expect(getAllLikedProductSpy).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
