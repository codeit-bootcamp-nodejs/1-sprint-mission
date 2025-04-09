export interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const articleResponseDTO = (article: Article) => {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image,
    userId: article.userId,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
