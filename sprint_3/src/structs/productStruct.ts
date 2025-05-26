import * as s from "superstruct";
import { PageParamsStruct } from "./commonStruct";

export const CreateProductBodyStuct = s.object({
  name: s.coerce(s.nonempty(s.string()), s.size(s.string(), 1, 100), (value) =>
    value.trim()
  ),
  description: s.nonempty(s.string()),
  price: s.min(s.integer(), 0),
  tags: s.array(s.nonempty(s.string())),
});

export const GetProductList = PageParamsStruct;

export const UpdateProductBodyStuct = s.partial(CreateProductBodyStuct);
