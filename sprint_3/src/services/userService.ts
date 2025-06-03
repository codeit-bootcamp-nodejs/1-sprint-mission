import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository";
import NotFoundError from "../lib/error/NotFoundError";
import UnauthorizedError from "../lib/error/UnauthorizedError";
import ForbiddenError from "../lib/error/ForbiddenError";
import {
  TokenType,
  UpdateUserDTO,
  UserDTO,
  CreateUserDTO,
} from "../dto/UserDTO";
import BadRequestError from "../lib/error/BadReqestError";
import { JWT_SECRET } from "../lib/constants";

type Token = Omit<UserDTO, "password">;

const hashingPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

function filterSensitiveUserData(user: UserDTO) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

const verifyPassword = async (inputPassword: string, password: string) => {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    throw new ForbiddenError("아이디 혹은 비밀번호를 확인해주세요");
  }
};

function createToken(user: Token, type: TokenType) {
  const payload = { id: user.id };
  const expiresIn = type === "refresh" ? "14d" : "1h";
  if (!JWT_SECRET) {
    throw new BadRequestError("JWT_SECRET");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

const createUser = async (user: CreateUserDTO) => {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    throw new BadRequestError("이미 가입된 이메일입니다.");
  }

  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });

  return filterSensitiveUserData(createdUser);
};

const getUser = async (email: string, password: string) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError("유저");
  }

  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
};

const updateUser = async (id: number, data: UpdateUserDTO) => {
  const dataToUpdate = { ...data };
  if (dataToUpdate.password) {
    const hashedPassword = await hashingPassword(dataToUpdate.password);
    dataToUpdate.password = hashedPassword;
  }

  const updateUser = await userRepository.update(id, dataToUpdate);

  return filterSensitiveUserData(updateUser);
};

const getUserId = async (userId: number, password: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("유저");
  }

  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
};

const getMyProduct = async (userId: number) => {
  const productList = await userRepository.getProduct(userId);

  return productList;
};

const getMyNotification = async (userId: number) => {
  const notificationList = await userRepository.getNotification(userId);

  return notificationList;
};

const refreshToken = async (userId: number, refreshToken: string) => {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError();
  }
  const accessToken = createToken(user, "access");
  const newRefreshToken = createToken(user, "refresh");
  return { accessToken, newRefreshToken };
};

export default {
  createUser,
  getUser,
  updateUser,
  refreshToken,
  createToken,
  getUserId,
  getMyProduct,
  getMyNotification,
};
