import { struct } from "superstruct";

export const CreateProduct = struct({
  name: "string",
  description: "string",
  price: "number",
  tags: ["string"],
});

export const CreateArticle = struct({
  title: "string",
  content: "string",
});

export const CreateComment = struct({
  content: "string",
  productId: "string?",
  articleId: "string?",
});
