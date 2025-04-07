import userRepository from "../repositories/userRepository.js";
import productRepository from "../repositories/productRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(inputPassword, password) {
  const isMatch = await bcrypt.compare(inputPassword, password);

  if (!isMatch) {
    const error = new Error("Unauthorized");
    error.data = 401;
    throw error;
  }
}

function filterSensitiveUserData(user) {
  const { password, ...rest } = user;
  return rest;
}

export async function fetchUser(id) {
  const user = await userRepository.getById(id);
  return filterSensitiveUserData(user);
}

export async function checkUserPassword(email, password) {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

export async function getUserByEmail(email) {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

export async function createNewUser(email, nickname, password) {
  const existedUser = await userRepository.getByEmail(email);

  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 422;
    error.data = { email: user.email };
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

export async function updateUserById(id, userData) {
  const newUserData = {
    nickname: userData.nickname,
    image: userData.image,
    refreshToken: userData.refreshToken,
  };
  const user = await userRepository.update(id, newUserData);
  return filterSensitiveUserData(user);
}

export async function changeUserPassword(id, password) {
  const hashedPassword = await hashingPassword(password);
  const updatedUser = await userRepository.changePassword(id, hashedPassword);
  return filterSensitiveUserData(updatedUser);
}

export async function getProducts(userId) {
  const products = await productRepository.getByUserId(userId);
  return products;
}

export function createToken(user, type) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === "refresh" ? "2w" : "1h" };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

export async function refreshAccessToken(userId, refreshToken) {
  const user = await userRepository.getById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  return accessToken;
}

export async function fetchLikedProduct(userId) {
  return await productRepository.getAllLikedProduct(userId);
}
