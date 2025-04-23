import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../lib/constants.js';
import userRepository from '../repository/userRepository.js';

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function createUser(user) {
  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.create({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  return filterSensitiveUserData(user);
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  return filterSensitiveUserData(user);
}

async function updateUser(id, data) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function updatePassword(id, password) {
  const hashedPassword = await hashingPassword(password);
  const updatedUser = await userRepository.update(id, { password: hashedPassword });
  return filterSensitiveUserData(updatedUser);
}

async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}

function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2d' : '6h',
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

export default {
  createUser,
  getUser,
  getUserById,
  updateUser,
  createToken,
  refreshToken,
  updatePassword,
};
