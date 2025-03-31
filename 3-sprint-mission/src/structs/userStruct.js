import * as s from "superstruct";

export const CreateUser = s.object({
  id: s.min(s.integer(), 0),
  email: s.size(s.string(), 1, 255),
  nickname: s.size(s.string(), 1, 20),
  image: s.size(s.string(), 0, 255),
  password: s.size(s.string(), 8, 20),
});
