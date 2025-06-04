import {
  createCommentService,
  createProductService,
  deleteProductService,
  getProductCommentService,
  getProductListService,
  getProductService,
  updateProductService,
} from './productService';
import NotFoundError from '../lib/errors/NotFoundError';
import {
  createProduct,
  deleteProduct,
  getById,
  getProduct,
  updateProduct,
} from '../repositories/productRepository';
import { getFavoriteList } from '../repositories/favoriteRepository';
import { createNotification } from './notificationService';
import { sendNotification } from './SocketService';
import { createProductComment, getProductComment } from '../repositories/commentRepository';

jest.mock('../repositories/productRepository');
jest.mock('../repositories/favoriteRepository');
jest.mock('../repositories/commentRepository');
jest.mock('../services/notificationService');
jest.mock('../services/SocketService');

describe('Product Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('상품 생성 유닛 테스트', async () => {
    const mockProduct = { id: 1, name: '테스트 상품' };
    (createProduct as jest.Mock).mockResolvedValue(mockProduct);

    const result = await createProductService({ name: '테스트 상품' } as any, 2);
    expect(result).toEqual(mockProduct);
    expect(createProduct).toHaveBeenCalled();
  });

  test('상품 세부 조회, 좋아요 확인', async () => {
    const product = { id: 1, favorites: [{ userId: 2 }] } as any;
    (getById as jest.Mock).mockResolvedValue(product);

    const result = await getProductService(1, 2);
    expect(result.favoriteCount).toBe(1);
    expect(result.isFavorited).toBe(true);
  });

  test('상품 조회시 존재하지 않는 상품은 에러 발생', async () => {
    (getById as jest.Mock).mockResolvedValue(null);
    await expect(getProductService(999)).rejects.toThrow(NotFoundError);
  });

  test('상품 수정, 가격 변동시 알림 전달', async () => {
    const oldProduct = { id: 1, price: 10000, name: '테스트 상품' };
    const updatedProduct = { id: 1, price: 20000, name: '테스트 상품' };
    const favorites = [{ userId: 2 }];

    (getById as jest.Mock).mockResolvedValue(oldProduct);
    (updateProduct as jest.Mock).mockResolvedValue(updatedProduct);
    (getFavoriteList as jest.Mock).mockResolvedValue(favorites);

    await updateProductService(1, { price: 20000 } as any);

    expect(createNotification).toHaveBeenCalled();
    expect(sendNotification).toHaveBeenCalled();
  });

  test('상품 삭제', async () => {
    (getById as jest.Mock).mockResolvedValue({ id: 1 });
    (deleteProduct as jest.Mock).mockResolvedValue({});

    await expect(deleteProductService(1)).resolves.not.toThrow();
  });

  test('상품 리스트 조회', async () => {
    (getProduct as jest.Mock).mockResolvedValue([{ id: 1, favorites: [] }]);
    const result = await getProductListService({ page: 1, pageSize: 10 } as any);
    expect(result.length).toBe(1);
  });

  test('상품에 대한 댓글 생성', async () => {
    (getById as jest.Mock).mockResolvedValue({ id: 1 });
    (createProductComment as jest.Mock).mockResolvedValue({
      id: 1,
      productId: 1,
      content: '테스트 댓글',
      userId: 2,
    });

    const result = await createCommentService({
      id: 1,
      productId: 1,
      content: '테스트 댓글',
      userId: 2,
    });

    expect(result.content).toBe('테스트 댓글');
  });

  test('페이지네이션으로 댓글 조회', async () => {
    const mockComments = [
      { id: 1, content: '테스트 댓글1' },
      { id: 2, content: '테스트 댓글 2' },
    ];

    (getById as jest.Mock).mockResolvedValue({ id: 1 });
    (getProductComment as jest.Mock).mockResolvedValue(mockComments);

    const result = await getProductCommentService({ productId: 1, limit: 1 });
    expect(result.comments.length).toBe(1);
    expect(result.nextCursor).toBe(1);
  });
});
