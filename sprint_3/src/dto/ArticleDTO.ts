export interface ArticleDTO {
  title: string;
  content: string;
  images?: string;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  images?: string;
}
