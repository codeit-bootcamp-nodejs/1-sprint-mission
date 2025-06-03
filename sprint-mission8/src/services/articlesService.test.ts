import * as articlesService from './articlesService';
import * as articlesRepository from '../repositories/articlesRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import type Article from '../types/Article';
import { PagePaginationParams } from '../types/pagination';

jest.mock('../repositories/articlesRepository');

describe('articlesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticleList', () => {
    it('게시글 목록을 반환한다', async () => {
      const mockParams: PagePaginationParams = { page: 1, pageSize: 10 };
      const mockResult = {
        list: [{ id: 1, title: 'Title', content: 'Content', userId: 1 } as Partial<Article>],
        totalCount: 1,
      };

      (articlesRepository.getArticleListWithLikes as jest.Mock).mockResolvedValue(mockResult);

      const result = await articlesService.getArticleList(mockParams);

      expect(articlesRepository.getArticleListWithLikes).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getArticle', () => {
    it('게시글이 존재하면 반환한다', async () => {
      const article: Partial<Article> = { id: 1, title: 'Title', content: 'Content', userId: 1 };
      (articlesRepository.getArticleWithLkes as jest.Mock).mockResolvedValue(article);

      const result = await articlesService.getArticle(1);

      expect(result).toEqual(article);
    });

    it('게시글이 존재하지 않으면 NotFoundError 발생', async () => {
      (articlesRepository.getArticleWithLkes as jest.Mock).mockResolvedValue(null);

      await expect(articlesService.getArticle(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('createArticle', () => {
    it('게시글 생성 후 like 기본값 포함하여 반환한다', async () => {
      const input = {
        title: 'Title',
        content: 'Content',
        image: '',
        userId: 1,
      };

      const created = {
        id: 1,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (articlesRepository.createArticle as jest.Mock).mockResolvedValue(created);

      const result = await articlesService.createArticle(input);

      expect(result).toMatchObject({
        ...created,
        likeCount: 0,
        isLiked: false,
      });
    });
  });

  describe('updateArticle', () => {
    it('게시글이 존재하고 본인일 경우 수정 후 반환', async () => {
      const existing = {
        id: 1,
        title: 'Title',
        content: 'Content',
        image: '',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
        likes: [],
      } as Awaited<ReturnType<typeof articlesRepository.getArticle>>;

      const updated = {
        id: 1,
        title: 'Updated Title',
        content: 'Content',
        image: '',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 5,
        isLiked: true,
        likes: [],
      } as Awaited<ReturnType<typeof articlesRepository.updateArticleWithLikes>>;

      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(existing);
      jest.spyOn(articlesRepository, 'updateArticleWithLikes').mockResolvedValue(updated);

      const result = await articlesService.updateArticle(1, { title: 'Updated Title', userId: 1 });

      expect(result).toEqual(updated);
    });

    it('존재하지 않으면 NotFoundError 발생', async () => {
      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(null);

      await expect(articlesService.updateArticle(999, { userId: 1 })).rejects.toThrow(
        NotFoundError,
      );
    });

    it('본인이 아니면 ForbiddenError 발생', async () => {
      const existing = {
        id: 1,
        title: 'Article By Other',
        content: 'Content',
        image: '',
        userId: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
        likes: [],
      } as Awaited<ReturnType<typeof articlesRepository.getArticle>>;

      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(existing);

      await expect(
        articlesService.updateArticle(1, { title: 'Trying Update', userId: 1 }),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('deleteArticle', () => {
    it('게시글이 존재하고 본인일 경우 정상 삭제된다', async () => {
      const mockArticle: Awaited<ReturnType<typeof articlesRepository.getArticle>> = {
        id: 1,
        title: 'Deleted Title',
        content: 'Delete Content',
        image: '',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
        likes: [],
      } as unknown as Awaited<ReturnType<typeof articlesService.getArticle>>;

      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(mockArticle);

      jest
        .spyOn(articlesRepository, 'deleteArticle')
        .mockResolvedValue(
          Promise.resolve() as unknown as Awaited<
            ReturnType<typeof articlesRepository.deleteArticle>
          >,
        );

      await expect(articlesService.deleteArticle(1, 1)).resolves.toBeUndefined();

      expect(articlesRepository.getArticle).toHaveBeenCalledWith(1);
      expect(articlesRepository.deleteArticle).toHaveBeenCalledWith(1);
    });

    it('게시글이 존재하지 않으면 NotFoundError를 던진다', async () => {
      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(null);

      await expect(articlesService.deleteArticle(999, 1)).rejects.toThrow(NotFoundError);
    });

    it('본인이 아닌 사용자가 삭제 시 ForbiddenError를 던진다', async () => {
      const mockArticle: Awaited<ReturnType<typeof articlesRepository.getArticle>> = {
        id: 1,
        title: 'Title By Other',
        content: 'Cannot Delete',
        image: '',
        userId: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
        likes: [],
      } as unknown as Awaited<ReturnType<typeof articlesService.getArticle>>;

      jest.spyOn(articlesRepository, 'getArticle').mockResolvedValue(mockArticle);

      await expect(articlesService.deleteArticle(1, 1)).rejects.toThrow(ForbiddenError);
    });
  });
});
