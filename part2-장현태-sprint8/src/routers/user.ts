import express from "express";
import {
  getUser,
  loginUser,
  postUser,
  patchUser,
  patchUserPassword,
  refreshUserAccessToken,
  getLikedProduct,
} from "../controllers/userController";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/jwtAuth";
import { getUserProduct } from "../controllers/productController";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyAccessToken, getUser)
  .post(postUser)
  .patch(verifyAccessToken, patchUser);

userRouter.route("/login").post(loginUser);
userRouter.route("/password").patch(verifyAccessToken, patchUserPassword);
userRouter.route("/products").get(verifyAccessToken, getUserProduct);
userRouter
  .route("/token/refresh")
  .post(verifyAccessToken, verifyRefreshToken, refreshUserAccessToken);
userRouter.route("/like").get(verifyAccessToken, getLikedProduct);

export default userRouter;
