import userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { createToken } from "../lib/tokens";
import { CreateUser, User } from "../dto/index";

// password hashing
async function hashingPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function isValidPassword(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    throw new Error("unauthorized");
  }
}
// password,token filter
// 비구조화할당 , rest operator
async function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function createUser(data: CreateUser) {
  const { email, nickname, password, image } = data;
  const existedUser = await userRepository.getByEmail(email);

  if (existedUser) {
    throw new Error("already user Email");
  }

  const hashedPwd = await hashingPassword(password);
  const newUser = await userRepository.save({
    ...data,
    password: hashedPwd,
    image: image || null,
  });
  return filterSensitiveUserData(newUser);
}

async function validUser(email: string, password: string) {
  const user = await userRepository.getByEmail(email);

  if (!user) {
    throw new Error("user not found");
  }
  await isValidPassword(password, user.password);
  return filterSensitiveUserData(user);
}

// refreshToken이 필요
async function update(id: number, data: Partial<User>) {
  return await userRepository.update(id, data);
}

async function meInfo(id: number) {
  const user = await userRepository.getById(id);
  if (!user) {
    throw new Error("user not found");
  }
  return filterSensitiveUserData(user);
}

async function refreshAccessToken(userId: number, refreshToken: string) {
  const user = await userRepository.getById(userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("unauthorized");
  }
  const accessToken = createToken(user, "access");
  return accessToken;
}

async function patchPassword(
  id: number,
  password: string,
  newPassword: string
) {
  const user = await userRepository.getById(id);
  console.log(user);
  console.log("password:", password, "newPassword:", newPassword);
  if (!user) {
    throw new Error("user not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Is password valid?", isPasswordValid); // 비교 결과를 확인
  console.log("Stored hashed password:", user.password); // 저장된 해시된 비밀번호 확인
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log("hashed:", hashedPassword);

  await userRepository.update(id, { password: hashedPassword });
  return { message: "patched password" };
}

export default {
  createUser,
  validUser,
  update,
  meInfo,
  refreshAccessToken,
  patchPassword,
};
