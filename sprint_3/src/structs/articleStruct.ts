import * as s from "superstruct";
import { PageParamsStruct } from "./commonStruct";

export const CreateArticleBodyStuct = s.object({
  title: s.coerce(s.nonempty(s.string()), s.size(s.string(), 1, 100), (value) =>
    value.trim()
  ),
  content: s.nonempty(s.string()),
});

export const GetArticleList = PageParamsStruct;

export const UpdateArticleBodyStuct = s.partial(CreateArticleBodyStuct);
