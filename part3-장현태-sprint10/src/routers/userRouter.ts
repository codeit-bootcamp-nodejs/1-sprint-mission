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
import { asyncHandler } from "../middleware/asyncHandler";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyAccessToken, asyncHandler(getUser))
  .post(asyncHandler(postUser))
  .patch(verifyAccessToken, asyncHandler(patchUser));

userRouter.route("/login").post(asyncHandler(loginUser));
userRouter
  .route("/password")
  .patch(verifyAccessToken, asyncHandler(patchUserPassword));
userRouter
  .route("/products")
  .get(verifyAccessToken, asyncHandler(getUserProduct));
userRouter
  .route("/token/refresh")
  .post(
    verifyAccessToken,
    verifyRefreshToken,
    asyncHandler(refreshUserAccessToken)
  );
userRouter.route("/like").get(verifyAccessToken, asyncHandler(getLikedProduct));

export default userRouter;
