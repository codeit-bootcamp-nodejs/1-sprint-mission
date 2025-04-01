import express from "express";
import {
  createLogin,
  createRefreshToken,
  creatUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import auth from "../lib/jwtAuth.js";

const userRoute = express.Router();

userRoute.post("/", creatUser);
userRoute.post("/login", createLogin);
userRoute.post("/token/refresh", auth.verifyRefreshToken, createRefreshToken);
userRoute.get("/:id", auth.verifyAccessToken, getUser);
userRoute.patch("/:id", auth.verifyAccessToken, updateUser);

export default userRoute;
