import * as s from "superstruct";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,15}$/;

export const CreateUserBodyStruct = s.object({
  email: s.coerce(s.pattern(s.string(), emailRegex), s.string(), (value) =>
    value.trim()
  ),
  nickname: s.coerce(
    s.pattern(s.string(), nicknameRegex),
    s.string(),
    (value) => value.trim()
  ),
  password: s.coerce(
    s.pattern(s.string(), passwordRegex),
    s.string(),
    (value) => value.trim()
  ),
  image: s.optional(s.string()),
});

export const UpdateUserBodyStruct = s.partial(CreateUserBodyStruct);
