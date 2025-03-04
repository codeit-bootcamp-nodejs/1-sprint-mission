import * as s from 'superstruct';

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 100),
  description: s.optional(s.string()),
  price: s.min(s.integer(),0),
  tags: s.optional(s.array(s.string()))
})

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 100),
  content: s.size(s.string(), 1, Infinity)
})

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 100000)
})

export const PatchComment = s.optional(CreateComment);