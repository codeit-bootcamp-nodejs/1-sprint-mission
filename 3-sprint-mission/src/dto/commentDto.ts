export interface Comment {
  id: number;
  content: string;
  productId?: number;
  articleId?: number;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComment {
  articleId: number;
  userId: number;
  content: string;
}
