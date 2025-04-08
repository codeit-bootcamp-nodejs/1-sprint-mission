import express from "express";
import { withAsync } from "../middleware/withAsync";
import {
  createUser,
  getUser,
  refreshToken,
  getUserInfo,
  patchUser,
  patchUserPassword,
} from "../controllers/userController";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/", withAsync(createUser));
userRouter.post("/login", withAsync(getUser));
userRouter.post("/token/refresh", verifyRefreshToken, withAsync(refreshToken));
userRouter.get("/info", verifyAccessToken, withAsync(getUserInfo));
userRouter.patch("/patch", verifyAccessToken, withAsync(patchUser));
userRouter.patch("/pwdPatch", verifyAccessToken, withAsync(patchUserPassword));

export default userRouter;
