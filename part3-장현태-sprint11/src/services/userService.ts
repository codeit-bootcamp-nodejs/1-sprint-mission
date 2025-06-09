import userRepository from "../repositories/userRepository";
import productRepository from "../repositories/productRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export async function hashingPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(inputPassword: string, password: string) {
  const isMatch = await bcrypt.compare(inputPassword, password);

  if (!isMatch) {
    const error = new Error("Unauthorized");
    throw error;
  }
}

function filterSensitiveUserData(user: User | null) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export async function fetchUser(id: string) {
  const user = await userRepository.getById(Number(id));
  return filterSensitiveUserData(user);
}

export async function checkUserPassword(email: string, password: string) {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    const error = new Error("Not Found");
    throw error;
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

export async function getUserByEmail(email: string) {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    const error = new Error("Not Found");
    throw error;
  }

  return filterSensitiveUserData(user);
}

export async function createNewUser(
  email: string,
  nickname: string,
  password: string
) {
  const existedUser = await userRepository.getByEmail(email);

  if (existedUser) {
    const error = new Error("User already exists");
    throw error;
  }

  const hashedPassword = await hashingPassword(password);
  const createdUser = await userRepository.save({
    email,
    nickname,
    password: hashedPassword,
    image: "",
  });
  return filterSensitiveUserData(createdUser);
}

export async function updateUserById(
  id: number,
  userData: {
    nickname?: string;
    image?: string;
    refreshToken?: string;
  }
) {
  const newUserData = {
    nickname: userData.nickname,
    image: userData.image,
    refreshToken: userData.refreshToken,
  };
  const user = await userRepository.update(Number(id), newUserData);
  return filterSensitiveUserData(user);
}

export async function changeUserPassword(id: string, password: string) {
  const hashedPassword = await hashingPassword(password);
  const updatedUser = await userRepository.changePassword(
    Number(id),
    hashedPassword
  );
  return filterSensitiveUserData(updatedUser);
}

export function createToken(
  user: Omit<User, "password">,
  type: string = "access"
) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    options as jwt.SignOptions
  );
  return token;
}

export async function refreshAccessToken(userId: string, refreshToken: string) {
  const user = await userRepository.getById(Number(userId));
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    throw error;
  }
  const accessToken = createToken(user);
  return accessToken;
}

export async function fetchLikedProduct(userId: string) {
  return await productRepository.getAllLikedProduct(userId);
}
