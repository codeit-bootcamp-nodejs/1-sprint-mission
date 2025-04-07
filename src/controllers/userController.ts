import { Request, Response } from "express";
import userService from "../services/userService";
import productService from "../services/productService";
import asyncHandler from "../utils/asyncHandler";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.getUser(email, password);

  const accessToken = userService.createToken(user);
  const refreshToken = userService.createToken(user, "refresh");

  await userService.updateUser(user.id, { refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ accessToken });
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth;
  const accessToken = await userService.refreshToken(userId, refreshToken);
  res.json({ accessToken });
});

const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const user = await userService.getUserById(userId);
  res.json(user);
});

const updateUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const updatedData = req.body;
  const updatedUser = await userService.updateUserInfo(userId, updatedData);
  res.json(updatedUser);
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;
  await userService.changePassword(userId, currentPassword, newPassword);
  res.status(200).json({ message: "Password updated successfully" });
});

const getUserProducts = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const products = await productService.getUserProducts(userId);
  res.status(200).json(products);
});

const getUserFavorites = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const favoriteProducts = await userService.getFavoriteProducts(userId);
  const likedArticles = await userService.getLikedArticles(userId);
  res.json({ favoriteProducts, likedArticles });
});

export default {
  createUser,
  loginUser,
  refreshToken,
  getUserInfo,
  updateUserInfo,
  changePassword,
  getUserProducts,
  getUserFavorites,
};
