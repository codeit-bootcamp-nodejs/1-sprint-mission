import * as s from "superstruct";

export const CreateProductBodyStruct = s.object({
  name: s.size(s.string(), 1, 50),
  description: s.size(s.string(), 1, 255),
  price: s.min(s.integer()),
  tags: s.array(s.string()),
  images: s.array(s.string()),
});

export const UpdateProductBodyStruct = s.partial(CreateProductBodyStruct);
