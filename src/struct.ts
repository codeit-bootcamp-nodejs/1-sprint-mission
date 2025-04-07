import {
  object,
  size,
  string,
  min,
  number,
  array,
  partial,
  Infer,
} from "superstruct";

export const CreateProduct = object({
  name: size(string(), 1, 60),
  description: string(),
  price: min(number(), 0),
  tags: array(string()),
});
export type CreateProductType = Infer<typeof CreateProduct>;

export const PatchProduct = partial(CreateProduct);
export type PatchProductType = Infer<typeof PatchProduct>;

export const CreateArticle = object({
  title: size(string(), 1, 100),
  content: string(),
});
export type CreateArticleType = Infer<typeof CreateArticle>;

export const PatchArticle = partial(CreateArticle);
export type PatchArticleType = Infer<typeof PatchArticle>;

export const CreateComment = object({
  content: string(),
});
export type CreateCommentType = Infer<typeof CreateComment>;

export const PatchComment = partial(CreateComment);
export type PatchCommentType = Infer<typeof PatchComment>;
