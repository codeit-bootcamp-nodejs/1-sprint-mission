import * as s from "superstruct";

export const CreateArticleBodyStruct = s.object({
  title: s.size(s.string(), 1, 50),
  content: s.size(s.string(), 1, 255),
  image: s.optional(s.size(s.string(), 1, 255)),
});

export const UpdateArticleBodyStruct = s.partial(CreateArticleBodyStruct);
