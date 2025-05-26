import { signupService, loginService } from '../services/authService';
import { Request, Response, NextFunction } from 'express';
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
