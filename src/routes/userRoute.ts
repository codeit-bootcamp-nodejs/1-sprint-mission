import express from "express";
import userController from "../controllers/userController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/users", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/token/refresh", userController.refreshToken);

router.get("/users/me", auth.verifyAccessToken, userController.getUserInfo);
router.patch(
  "/users/me",
  auth.verifyAccessToken,
  userController.updateUserInfo
);
router.patch(
  "/users/me/password",
  auth.verifyAccessToken,
  userController.changePassword
);
router.get(
  "/users/me/products",
  auth.verifyAccessToken,
  userController.getUserProducts
);
router.get(
  "/users/me/favorites",
  auth.verifyAccessToken,
  userController.getUserFavorites
);

export default router;
