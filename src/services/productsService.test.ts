import * as productService from './productsService';
import * as productsRepository from '../repositories/productsRepository';
import * as favoritesRepository from '../repositories/favoritesRepository';
import * as notificationsService from './notificationsService';
import { NotificationType } from '../types/Notification';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';

jest.mock('../repositories/productsRepository');
jest.mock('../repositories/favoritesRepository');
jest.mock('./notificationsService');

describe('productService', () => {
  const baseProduct = {
    id: 1,
    name: '상품명',
    description: '설명',
    price: 10000,
    tags: ['태그'],
    images: ['img1.jpg'],
    userId: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('상품을 생성하고 favorite 정보를 추가한다', async () => {
      (productsRepository.createProduct as jest.Mock).mockResolvedValue(baseProduct);

      const result = await productService.createProduct({
        name: '상품명',
        description: '설명',
        price: 10000,
        tags: ['태그'],
        images: ['img1.jpg'],
        userId: 10,
      });

      expect(result).toMatchObject({
        id: baseProduct.id,
        name: baseProduct.name,
        favoriteCount: 0,
        isFavorited: false,
      });
      expect(productsRepository.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ name: '상품명' }),
      );
    });
  });

  describe('getProduct', () => {
    it('존재하지 않는 상품일 경우 NotFoundError를 던진다', async () => {
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(null);
      await expect(productService.getProduct(999)).rejects.toThrow(NotFoundError);
    });

    it('정상적으로 상품을 반환한다', async () => {
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(baseProduct);
      const product = await productService.getProduct(1);
      expect(product).toEqual(baseProduct);
    });
  });

  describe('updateProduct', () => {
    it('권한이 없을 경우 ForbiddenError를 던진다', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue({
        ...baseProduct,
        userId: 999,
      });

      await expect(
        productService.updateProduct(1, { userId: 10, name: '다른 상품명' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('가격이 변경되었을 경우 알림을 생성한다', async () => {
      const updatedProduct = { ...baseProduct, price: 12000 };
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(baseProduct);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue(
        updatedProduct,
      );
      (favoritesRepository.getFavoritesByProductId as jest.Mock).mockResolvedValue([
        { userId: 2 },
        { userId: 3 },
      ]);

      await productService.updateProduct(1, { userId: 10, price: 12000 });

      expect(notificationsService.createNotifications).toHaveBeenCalledWith([
        {
          userId: 2,
          type: NotificationType.PRICE_CHANGED,
          payload: { productId: 1, price: 12000 },
        },
        {
          userId: 3,
          type: NotificationType.PRICE_CHANGED,
          payload: { productId: 1, price: 12000 },
        },
      ]);
    });
  });

  describe('deleteProduct', () => {
    it('권한이 없는 경우 ForbiddenError', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue({
        ...baseProduct,
        userId: 999,
      });

      await expect(productService.deleteProduct(1, 10)).rejects.toThrow(ForbiddenError);
    });

    it('존재하지 않는 상품이면 NotFoundError', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);

      await expect(productService.deleteProduct(999, 10)).rejects.toThrow(NotFoundError);
    });

    it('정상 삭제 시 호출됨', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(baseProduct);
      await productService.deleteProduct(1, 10);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
