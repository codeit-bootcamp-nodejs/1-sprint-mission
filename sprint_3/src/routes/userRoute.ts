import express from "express";
import {
  createLogin,
  createRefreshToken,
  createUser,
  getUser,
  updateUser,
  getMyProduct,
  getMyNotification,
} from "../controllers/userController";
import auth from "../lib/jwtAuth";
import { catchHandler } from "../lib/catchHandler";

const userRoute = express.Router();

userRoute.post("/", catchHandler(createUser));
userRoute.post("/login", catchHandler(createLogin));
userRoute.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  catchHandler(createRefreshToken)
);
userRoute.get(
  "/productlist",
  auth.verifyAccessToken,
  catchHandler(getMyProduct)
);
userRoute.get(
  "/notification",
  auth.verifyAccessToken,
  catchHandler(getMyNotification)
);
userRoute.get("/me", auth.verifyAccessToken, catchHandler(getUser));
userRoute.patch("/:id", auth.verifyAccessToken, catchHandler(updateUser));

export default userRoute;
