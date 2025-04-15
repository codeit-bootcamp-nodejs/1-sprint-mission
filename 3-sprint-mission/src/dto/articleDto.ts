export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticle {
  title: string;
  content: string;
}

export interface UpdateArticle extends Partial<CreateArticle> {}
