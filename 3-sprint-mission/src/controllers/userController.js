import { prismaClient } from "../lib/prismaClient.js";
import { JWT_SECRET } from "../lib/constants.js";
import { createToken } from "../lib/tokens.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// password hashing
function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

// password,token filter
// 비구조화할당 , rest operator
function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

// signUp
export async function createUser(req, res) {
  const { email, nickname, password, image } = req.body;
  const existedUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existedUser) {
    const error = new Error("user already exists");
    error.code = 409;
    error.data = { email };
    throw error;
  }

  const hashedPassword = await hashingPassword(password);

  const newUser = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
      image: image || null,
    },
  });

  res.status(201).json({ newUser });
}

// login
export async function getUser(req, res) {
  const { email, password } = req.body;
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  if (!user) {
    const error = new Error("user not found");
    error.code = 404;
    throw error;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error("unauthorized");
    error.code = 401;
    throw error;
  }

  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refresh");

  await prismaClient.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ accessToken });
}

// token / refresh
export async function refreshToken(req, res) {
  const { userId } = req.auth;
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });
  if (!user || user.refreshToken !== req.cookies.refreshToken) {
    const error = new Error("unauthorized");
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  return res.status(201).json({ accessToken });
}

export async function getUserInfo(req, res) {
  const { userId } = req.user;
  //찾은 Id값과 일치하는 user정보가져오기
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      nickname: true,
      email: true,
      createdAt: true,
    },
  });
  return res.status(201).json({ user });
}

export async function patchUser(req, res) {
  const { userId } = req.user;
  const user = await prismaClient.user.update({
    where: { id: userId },
    data: req.body,
  });
  const filteredUserData = filterSensitiveUserData(user);
  return res.status(200).json({ filteredUserData });
}

export async function patchUserPassword(req, res) {
  const { userId } = req.user;
  const { password, newPassword } = req.body;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    const error = new Error("user not found");
    error.code = 404;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error("invalid login!");
    error.code = 401;
    throw error;
  }

  const hashedPassword = await hashingPassword(newPassword);
  const newUser = await prismaClient.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  const filteredUserData = filterSensitiveUserData(newUser);
  return res
    .status(200)
    .json({ filteredUserData, message: "Password updated" });
}

export async function getUserProducts(req, res) {
  const { userId } = req.user;

  const products = await prismaClient.product.findMany({
    where: { userId },
    select: {
      name: true,
      description: true,
      price: true,
      tags: true,
    },
  });

  if (!products) {
    const error = new Error("user not found");
    error.code = 400;
    throw error;
  }

  return res.status(200).json({ products });
}

export async function getUserLikeProducts(req, res) {
  // 로그인한 유저 정보 추출:
  const { userId } = req.user;
  // 상품목록조회
  const products = await prismaClient.product.findMany({
    where: { ProductLikes: { some: { userId } } },
    select: {
      id: true,
      name: true,
      price: true,
      likeCount: true,
    },
  });
  return res.status(201).json({ products });
}
