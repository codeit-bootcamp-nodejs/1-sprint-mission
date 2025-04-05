import userRepository from "../repositories/userRepository.js";
import articleRepository from "../repositories/articleRepository.js";
import productRepository from "../repositories/productRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function hasingPassword(password) {
  const salt = 10;
  return bcrypt.hash(password, salt);
}

async function createUser(user) {
  const exitstedUser = await userRepository.findByEmail(user.email);

  if (exitstedUser) {
    const error = new Error("User already exists");
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

async function updateUser(id, data) {
  return await userRepository.update(id, data);
}

function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  return createToken(user);
}

async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
}

async function updateUserInfo(userId, updatedData) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    throw error;
  }

  const updatedUser = await userRepository.update(userId, updatedData);
  return filterSensitiveUserData(updatedUser);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.code = 400;
    throw error;
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.update(userId, { password: hashedNewPassword });
}

async function getFavoriteProducts(userId) {
  const favoriteProducts = await productRepository.findFavoritesByUser(userId);
  return favoriteProducts.map((product) => ({
    ...product,
    isLiked: true,
  }));
}

async function getLikedArticles(userId) {
  const likedArticles = await articleRepository.findLikesByUser(userId);
  return likedArticles.map((article) => ({
    ...article,
    isLiked: true,
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
