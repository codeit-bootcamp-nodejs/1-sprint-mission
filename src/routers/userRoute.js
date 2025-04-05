import express from "express";
import {
  createUser,
  accessTokenLogin,
  getUserInfo,
  updateUser,
  updateUserPassword,
  refreshToken,
} from "../controllers/userController.js";
import { withAsync } from "../middlewares/withAsync.js";
import { verifyUser } from "../middlewares/auth/verifyUser.js";
import {
  verifyAccessToken,
  verifyDecodeAccessToken,
  verifyRefreshToken,
} from "../middlewares/auth/verifyToken.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { getUserPoroductList } from "../services/userService.js";

const userRouter = express.Router();

userRouter.post("/users", withAsync(createUser));
userRouter.post("/login", authenticateUser, withAsync(accessTokenLogin));
userRouter.get(
  "/user_info/:id",
  verifyDecodeAccessToken,
  verifyUser,
  withAsync(getUserInfo)
);
userRouter.patch(
  "/user_info/:id",
  verifyDecodeAccessToken,
  verifyUser,
  withAsync(updateUser)
);

userRouter.patch(
  "/user_info/password/:id",
  verifyDecodeAccessToken,
  verifyUser,
  withAsync(updateUserPassword)
);

userRouter.get(
  "/users/:id",
  verifyDecodeAccessToken,
  verifyUser,
  withAsync(getUserPoroductList)
);
userRouter.post("/token/refresh", verifyRefreshToken, withAsync(refreshToken));

export default userRouter;
