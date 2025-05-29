import {
  fetchUser,
  createNewUser,
  updateUserById,
  checkUserPassword,
  createToken,
  changeUserPassword,
  refreshAccessToken,
  fetchLikedProduct,
} from "../services/userService";
import { RequestHandler } from "express";

export const getUser: RequestHandler = async (req, res, next) => {
  const users = await fetchUser(req.user!.userId);
  return res.json(users);
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const user = await checkUserPassword(req.body.email, req.body.password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refresh");
  await updateUserById(Number(user.id), { refreshToken });
  res.cookie("refreshToken", refreshToken, {
    path: "/token/refresh",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.json({ accessToken });
};

export const postUser: RequestHandler = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  const newUser = await createNewUser(email, nickname, password);
  return res.json(newUser);
};

export const patchUser: RequestHandler = async (req, res, next) => {
  const updatedUser = await updateUserById(Number(req.user!.userId), req.body);
  return res.json(updatedUser);
};

export const patchUserPassword: RequestHandler = async (req, res, next) => {
  const updatedUser = await changeUserPassword(
    req.user!.userId,
    req.body.password
  );
  return res.json(updatedUser);
};

export const refreshUserAccessToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const accessToken = await refreshAccessToken(
    req.user!.userId,
    req.cookies.refreshToken
  );
  return res.json({ accessToken });
};

export const getLikedProduct: RequestHandler = async (req, res, next) => {
  const products = await fetchLikedProduct(req.user!.userId);
  return res.json(products);
};
