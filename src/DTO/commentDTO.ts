import Comment from '../types/comment';

export const commentResponseDTO = (comment: Comment) => {
  return {
    content: comment.content,
    productId: comment.productId,
    articleId: comment.articleId,
    userId: comment.userId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

export interface CreateArticleCommentDTO {
  id?: number;
  content: string;
  articleId: number;
  userId: number;
}

export interface GetArticleCommentDTO {
  content: string;
  articleId: number;
  userId: number;
}

export interface CreateProductCommentDTO {
  id?: number;
  content: string;
  productId: number;
  userId: number;
}

export interface GetProductCommentDTO {
  content: string;
  productId: number;
  userId: number;
}

export interface UpdateCommentDTO {
  content: string;
  userId?: number;
}
