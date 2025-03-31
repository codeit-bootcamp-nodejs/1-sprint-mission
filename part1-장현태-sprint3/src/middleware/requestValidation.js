import * as s from "superstruct";

const createArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 200),
});

const createProduct = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 30),
  price: s.min(s.integer(), 1),
  tags: s.array(),
});

export function postArticleValidation(req, res, next) {
  s.assert(req.body, createArticle);
  next();
}

export function postProductValidation(req, res, next) {
  s.assert(req.body, createProduct);
  next();
}
