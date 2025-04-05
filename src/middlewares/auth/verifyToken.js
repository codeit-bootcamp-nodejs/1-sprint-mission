import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const verifyAccessToken = expressjwt({
  secret: secret,
  algorithms: ["HS256"],
  requestProperty: "user",
});

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

export const verifyDecodeAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const decoded = jwt.verify(token, secret);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error(err);
  }
};
