import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "./constants";

const optionalVerifyAccessToken = expressjwt({
  secret: JWT_SECRET!,
  algorithms: ["HS256"],
  credentialsRequired: false,
  requestProperty: "user",
  getToken: (req) => req.cookies.accessToken,
});

const verifyAccessToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
  getToken: (req) => req.cookies.accessToken,
});

const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
  requestProperty: "user",
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
  optionalVerifyAccessToken,

};
