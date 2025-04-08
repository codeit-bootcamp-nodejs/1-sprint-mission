import jwt from "jsonwebtoken";
import ms from "ms";
import { JWT_SECRET } from "../lib/constants";
import { User } from "../dto/index";

// access , refresh
export function createToken(
  user: Pick<User, "id">,
  type: "access" | "refresh"
) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: ms(type === "refresh" ? "2w" : "1h"),
  };
  return jwt.sign(payload, JWT_SECRET, options);
}
