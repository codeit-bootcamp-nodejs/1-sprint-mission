import userService from "../services/userService.js";

export const creatUser = async (req, res) => {
  const user = await userService.createUser({ ...req.body });
  res.status(201).send(user);
};

export const createLogin = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  const user = await userService.getUser(email, nickname, password);
  const accessToken = userService.createToken(user);
  const refreshToken = userService.createToken(user, "refresh");
  await userService.updateUser(user.id, { refreshToken });
  res.cookie("refreshToken", refreshToken, {
    path: "/token/refresh",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.json({ accessToken });
  next()
};

export const createRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth;
  const { accessToken, newRefreshToken } = await userService.refreshToken(
    userId,
    refreshToken
  );
  await userService.updateUser(userId, { refreshToken: newRefreshToken });
  res.cookie("refreshToken", newRefreshToken, {
    path: "/users/token/refresh",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.json({ accessToken });
};

export const getUser = async (req, res) => {
  const userId = req.user.userId;

  const user = await userService.getUserId(userId);
  return res.status(200).send(user);
};

export const updateUser = async (req, res) => {
  const userId = req.user.userId;
  const data = req.body;
  const updateUser = await userService.updateUser(userId, data);
  return res.status(201).send(updateUser);
};
