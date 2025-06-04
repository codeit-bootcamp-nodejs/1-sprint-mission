import bcrypt from 'bcrypt';
import BadRequestError from '../lib/errors/BadRequestError';
import { CreateUserDTO, LoginUserDTO, userResponseDTO, UserResponseDTO } from '../DTO/userDTO';
import { generateTokens, verifyRefreshToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME, NODE_ENV, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import { Request, Response } from 'express';
import { findByEmail, findById, save } from '../repositories/authRepository';

export async function register(data: CreateUserDTO): Promise<UserResponseDTO> {
  const password = data.password;
  const email = data.email;
  const nickname = data.nickname;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isExist = await findByEmail(email);

  if (isExist) {
    throw new BadRequestError('User already exist');
  }

  const user = await save({
    email,
    nickname,
    password: hashedPassword,
  });

  return userResponseDTO(user);
}

export async function login(data: LoginUserDTO, res: Response): Promise<void> {
  const { email, password } = data;

  const user = await findByEmail(email);
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
}

export const refreshTokenService = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  // const { userId } = verifyRefreshToken(refreshToken);

  let userId;
  try {
    const payload = verifyRefreshToken(refreshToken);
    userId = payload.userId;
  } catch (err) {
    throw new BadRequestError('Invalid refresh token');
  }

  const user = await findById(userId);
  if (!user) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(userId);
  setTokenCookies(res, accessToken, newRefreshToken);

  res.status(200).send();
};

export function setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000,
  });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh',
  });
}
