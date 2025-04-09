import { Request, Response } from 'express';
import {
  getMeService,
  getMyFavoriteListService,
  getMyProductListService,
  updateMeService,
  updateMyPasswordService,
} from '../services/userService';
import { create } from 'superstruct';
import {
  GetMyFavoriteListParamsStruct,
  GetMyProductListParamsStruct,
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
} from '../structs/usersStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await getMeService(req.user.id);

  res.status(200).json(user);
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const data = create(req.body, UpdateMeBodyStruct);

  const updatedMe = await updateMeService(req.user.id, data);

  res.status(200).json(updateMe);
};

export async function updateMyPassword(req: Request, res: Response): Promise<void> {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);

  await updateMyPasswordService(req.user.id, password, newPassword);
  res.status(200).json({ message: 'Password change successful' });
}

export async function getMyProductList(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const params = create(req.query, GetMyProductListParamsStruct);
  const result = await getMyProductListService(req.user.id, params);
  res.status(200).json(result);
}

export async function getMyFavoriteList(req: Request, res: Response): Promise<void> {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetMyFavoriteListParamsStruct);
  const result = await getMyFavoriteListService(req.user.id, { page, pageSize, orderBy, keyword });

  res.status(200).json(result);
}
