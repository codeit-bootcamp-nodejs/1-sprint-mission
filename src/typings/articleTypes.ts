import { Infer } from 'superstruct';
import { GetArticleListParamsStruct } from '../structs/articlesStructs';

export interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GetArticleListParamsInput = Infer<typeof GetArticleListParamsStruct>;
