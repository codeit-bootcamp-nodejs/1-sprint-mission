import {
  updateMyInfoService,
  updateMyPasswordService,
  getMyProductsService,
} from '../services/usersService';
import { Request, Response } from 'express'

export async function getMyInfo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다' });
  const { password: _, ...safeUser } = req.user;
  res.json(safeUser);
}

export const updateMyInfo = async (req: Request, res: Response) => {
  const updatedUser = await updateMyInfoService(req.user!.id, req.body);
  res.status(200).json(updatedUser);
};

export const updateMyPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력하세요.' });
  }

  await updateMyPasswordService(req.user!.id, currentPassword, newPassword);
  res.status(204).send();
};

export const getMyProducts = async (req: Request, res: Response) => {
  const myProducts = await getMyProductsService(req.user!.id);
  res.status(200).json(myProducts);
};
