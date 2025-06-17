import * as s from "superstruct";
import { CursorParamsStruct } from "./commonStruct";

export const CreateCommentBodyStruct = s.object({
  content: s.size(s.string(), 5, 300),

});

export const GetCommentList = CursorParamsStruct;

export const UpdateCommentBodyStruct = s.partial(CreateCommentBodyStruct);

