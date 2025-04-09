import { create } from 'superstruct';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs';
import { login, refreshTokenService, register } from '../services/authService';
import { Request, Response } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);

  const data = await register({ password, email, nickname });

  res.status(201).json(data);
};

export const loginUser = async (req: Request, res: any): Promise<void> => {
  const { email, password } = create(req.body, LoginBodyStruct);

  await login({ email, password }, res);

  res.status(200).json({ message: 'Login success' });
};

export function clearTokenCookies(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  clearTokenCookies(res);
  res.status(200).json({ message: 'Successfully logged out.' });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  await refreshTokenService(req, res);
};
