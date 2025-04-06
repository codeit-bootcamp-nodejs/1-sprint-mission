import userRepository from "../repositories/userRepository";
import articleRepository from "../repositories/articleRepository";
import productRepository from "../repositories/productRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Product, Article } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

interface UserInput {
  email: string;
  password: string;
  nickname: string;
}

function filterSensitiveUserData(
  user: User
): Omit<User, "password" | "refreshToken"> {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function hasingPassword(password: string): Promise<string> {
  const salt = 10;
  return bcrypt.hash(password, salt);
}

async function createUser(user: UserInput) {
  const exitstedUser = await userRepository.findByEmail(user.email);

  if (exitstedUser) {
    const error: any = new Error("User already exists");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hasingPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

async function updateUser(id: string, data: Partial<User>) {
  return await userRepository.update(id, data);
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error: any = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error: any = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

function createToken(
  user: Pick<User, "id">,
  type: "refresh" | "access" = "access"
) {
  const payload = { userId: user.id };
  const expiresIn = type === "refresh" ? "14d" : "1h";

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

async function refreshToken(userId: string, refreshToken: string) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error: any = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  return createToken(user);
}

async function getUserById(userId: string) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.code = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
}

async function updateUserInfo(userId: string, updatedData: Partial<User>) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.code = 404;
    throw error;
  }

  const updatedUser = await userRepository.update(userId, updatedData);
  return filterSensitiveUserData(updatedUser);
}

async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.code = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error: any = new Error("Current password is incorrect");
    error.code = 400;
    throw error;
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.update(userId, { password: hashedNewPassword });
}

async function getFavoriteProducts(
  userId: string
): Promise<(Product & { isLiked: true })[]> {
  const favoriteProducts = await productRepository.findFavoritesByUser(userId);
  return favoriteProducts.map((product) => ({
    ...product,
    isLiked: true as const,
  }));
}

async function getLikedArticles(
  userId: string
): Promise<(Article & { isLiked: true })[]> {
  const likedArticles = await articleRepository.findLikesByUser(userId);
  return likedArticles.map((article) => ({
    ...article,
    isLiked: true as const,
  }));
}

export default {
  createUser,
  updateUser,
  getUser,
  createToken,
  refreshToken,
  getUserById,
  updateUserInfo,
  changePassword,
  getFavoriteProducts,
  getLikedArticles,
};
