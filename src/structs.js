import * as s from "superstruct";

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 50),
  description: s.size(s.string(), 1, 100),
  price: s.min(s.number(), 0),
  tags: s.size(s.string(), 1, 30),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 100),
  content: s.size(s.string(), 1, 30),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  productId: s.any(),
  articleId: s.any(),
  content: s.size(s.string(), null, 300),
});

export const PatchComment = s.partial(CreateComment);
