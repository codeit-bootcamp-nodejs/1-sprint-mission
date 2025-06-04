// 테스트는 실제 데이터베이스 요청하면 ㅇ나됨, jest.mock()으로ㅓ 가짜함수로 바꾸는것
import ForbiddenError from "../lib/errors/ForbiddenError";
import NotFoundError from "../lib/errors/NotFoundError";
import * as productsRepository from "../repositories/productsRepository";
import * as productServices from "../services/productsService";

jest.mock("../repositories/productsRepository");

describe("Products Service", () => {
  const mockProduct = {
    id: 1,
    name: "LG 그램",
    description: "LG",
    price: 29000,
    tags: ["electronics"],
    images: ["img.jpg"],
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteCount: 0,
    isFavorited: false,
    favorites: undefined,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    test("상품 생성할 수 있음", async () => {
      jest
        .mocked(productsRepository.createProduct)
        .mockResolvedValue(mockProduct);
      const result = await productServices.createProduct({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        tags: mockProduct.tags,
        images: mockProduct.images,
        userId: mockProduct.userId,
      });

      expect(result).toEqual({
        ...mockProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
      expect(productsRepository.createProduct).toHaveBeenCalledWith({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
        tags: mockProduct.tags,
        images: mockProduct.images,
        userId: mockProduct.userId,
      });
    });
  });

  describe("getProduct", () => {
    test("상품을 조회할 수 있음", async () => {
      jest
        .mocked(productsRepository.getProductWithFavorites)
        .mockResolvedValue(mockProduct);
      const result = await productServices.getProduct(mockProduct.id);
      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(
        mockProduct.id
      );
      expect(result).toEqual({
        ...mockProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });
    test("존재하지 않는 상품의 ID값이면 NotFoundError를 발생", async () => {
      jest
        .mocked(productsRepository.getProductWithFavorites)
        .mockResolvedValue(null);
      // 에러 케이스를 테스트 할 때 변수에 할당해서 비동기함수가 에러를 던지는지 확인
      // const result = await ... 방식으로하면 에러가발생하게되고 이후 코드가 실행x 테스트 못함
      // 에러 테스트는 함수실행자체를 rejects.tothrow로 감싸면 됨
      await expect(productServices.getProduct(999)).rejects.toThrow(
        new NotFoundError("product", 999)
      );
    });
  });

  describe("getProductsList", () => {
    test("상품목록을 조회할 수 있음", async () => {
      jest
        .mocked(productsRepository.getProductListWithFavorites)
        .mockResolvedValue({ list: [mockProduct], totalCount: 1 });
      const params = { page: 1, pageSize: 10 };
      const result = await productServices.getProductList(params, {
        userId: mockProduct.userId,
      });
      expect(
        productsRepository.getProductListWithFavorites
      ).toHaveBeenCalledWith(params, { userId: mockProduct.userId });
      expect(result).toEqual({ list: [mockProduct], totalCount: 1 });
    });
  });

  describe("updateProduct", () => {
    test("해당 상품의 정보를 수정할 수 있음", async () => {
      const updateData = {
        name: "삼성노트북",
        description: "삼성",
        price: 29000,
        userId: 1,
      };

      const updated = {
        ...mockProduct,
        ...updateData,
        // 스프레드문법을 이어서 쓰면 맨 마지막 객체의 정보로 덮어씌워짐 우선순위 기준 -> 맨 뒤
      };
      jest.mocked(productsRepository.getProduct).mockResolvedValue(mockProduct);
      jest
        .mocked(productsRepository.updateProductWithFavorites)
        .mockResolvedValue(updated);
      const result = await productServices.updateProduct(
        mockProduct.id,
        updated
      );
      expect(productsRepository.getProduct).toHaveBeenCalledWith(
        mockProduct.id
      );
      expect(
        productsRepository.updateProductWithFavorites
      ).toHaveBeenCalledWith(mockProduct.id, updated);
      expect(result).toEqual(updated);
    });
  });

  describe("deleteProduct", () => {
    test("해당 상품을 삭제할 수 있음", async () => {
      jest
        .spyOn(productsRepository, "getProduct")
        .mockResolvedValue(mockProduct);
      const deleteMock = jest
        .spyOn(productsRepository, "deleteProduct")
        .mockResolvedValue(mockProduct);
      await productServices.deleteProduct(mockProduct.id, mockProduct.userId);
      expect(deleteMock).toHaveBeenCalledWith(mockProduct.id);
      expect(deleteMock).toHaveReturnedTimes(1);
    });

    test("본인이 아닌 상품일 경우 ForbiddenError 발생", async () => {
      const otherUserProduct = { ...mockProduct, userId: 2 };

      jest
        .spyOn(productsRepository, "getProduct")
        .mockResolvedValue(otherUserProduct);

      await expect(
        productServices.deleteProduct(mockProduct.id, 1)
      ).rejects.toThrow(
        new ForbiddenError("Should be the owner of the product")
      );
    });
  });
});
