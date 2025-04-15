import { createToken } from "../lib/tokens";
import { jwtPayload } from "../dto/index";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../dto/index";
import userService from "../services/userService";

// signUp
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, nickname, password, image } = req.body;
  try {
    const user = await userService.createUser({
      email,
      nickname,
      password,
      image,
    });
    return res.send(user);
  } catch (error) {
    return next(error);
  }
}

// login
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const user = await userService.validUser(email, password);
    const accessToken = createToken(user, "access");
    const refreshToken = createToken(user, "refresh");
    if (user.id) {
      await userService.update(user.id, { refreshToken });
    }
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).send({ accessToken });
  } catch (error) {
    return next(error);
  }
}

// token / refresh
export async function refreshToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.auth;
  const refreshToken = req.cookies.refreshToken;
  try {
    const accessToken = await userService.refreshAccessToken(
      userId,
      refreshToken
    );
    return res.status(200).send({ accessToken });
  } catch (error) {
    return next(error);
  }
}

export async function getUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user as jwtPayload;
  const userId = user.id;
  try {
    const user = await userService.meInfo(userId);
    return res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

export async function patchUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const patchData = req.body;
    const patchedUser = await userService.update(userId, patchData);

    return res.status(200).send(patchedUser);
  } catch (error) {
    next(error);
  }
}

export async function patchUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const { password, newPassword } = req.body;

    await userService.patchPassword(userId, password, newPassword);
    res.status(200);
  } catch (error) {
    next(error);
  }
}
