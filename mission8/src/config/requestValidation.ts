import * as s from "superstruct";

export const createArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 200),
});

export const createProduct = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 30),
  price: s.min(s.integer(), 1),
  tags: s.array(),
});