import express from "express";
import {
  getUser,
  LoginUser,
  postUser,
  patchUser,
  patchUserPassword,
  getUserProduct,
  refreshUserAccessToken,
  getLikedProduct,
} from "../controllers/userController.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/jwtAuth.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyAccessToken, getUser)
  .post(postUser)
  .patch(verifyAccessToken, patchUser);

userRouter.route("/login").post(LoginUser);
userRouter.route("/password").patch(verifyAccessToken, patchUserPassword);
userRouter.route("/products").get(verifyAccessToken, getUserProduct);
userRouter
  .route("/token/refresh")
  .post(verifyAccessToken, verifyRefreshToken, refreshUserAccessToken);
userRouter.route("/like").get(verifyAccessToken, getLikedProduct);

export default userRouter;
