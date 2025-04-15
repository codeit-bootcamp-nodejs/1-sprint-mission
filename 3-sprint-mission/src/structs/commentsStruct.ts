import * as s from "superstruct";

export const CreateCommentBodyStruct = s.object({
  content: s.size(s.string(), 1, 50),
});

export const UpdateCommentBodyStruct = s.partial(CreateCommentBodyStruct);
