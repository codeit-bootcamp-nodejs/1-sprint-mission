import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import { prismaClient } from "../middlewares/prismaClient.js";

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function createUserService(user) {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
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

async function verifyPassword(inPutPassword, savedPassword) {
  const isValid = await bcrypt.compare(inPutPassword, savedPassword);
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

async function updateUser(id, data) {
  return await userRepository.update(id, data);
}

async function getUserInfoService(id, data) {
  const existUser = await userRepository.findById(id);

  if (!existUser) {
    const error = new Error("This is a non-existent user");
    error.code = 403;
    throw error;
  }

  const user = {
    ...existUser,
    ...data,
  };

  return filterSensitiveUserData(user);
}

async function updateUserService(id, data) {
  const user = await userRepository.update(id, data);

  return filterSensitiveUserData(user);
}

export async function updateUserPasswordService(id, password) {
  const hashedPassword = await hashingPassword(password);
  const parsedId = parseInt(id, 10);

  const updatedUser = await userRepository.update(parsedId, {
    password: hashedPassword,
  });

  return filterSensitiveUserData(updatedUser);
}

export async function getUserPoroductList(req, res) {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);
  const user = await prismaClient.user.findUnique({
    where: { id: parsedId },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  res.status(200).send(user);
}

async function refreshTokenService(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { accessToken, newRefreshToken };
}

export default {
  createUserService,
  getUser,
  createToken,
  getUserInfoService,
  hashingPassword,
  updateUserService,
  updateUserPasswordService,
  getUserPoroductList,
  updateUser,
  refreshTokenService,
};
