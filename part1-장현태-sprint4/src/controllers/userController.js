import {
  fetchUser,
  createNewUser,
  updateUserById,
  checkUserPassword,
  createToken,
  changeUserPassword,
  getProducts,
  refreshAccessToken,
  fetchLikedProduct,
} from "../services/user.js";

export async function getUser(req, res, next) {
  try {
    const users = await fetchUser(req.user.userId);
    return res.json(users);
  } catch (error) {
    next(error);
  }
}
export async function LoginUser(req, res, next) {
  try {
    const user = await checkUserPassword(req.body.email, req.body.password);
    const accessToken = createToken(user);
    const refreshToken = createToken(user, "refresh");
    await updateUserById(user.id, { refreshToken });
    await res.cookie("refreshToken", refreshToken, {
      path: "/token/refresh",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}
export async function postUser(req, res, next) {
  try {
    const { email, nickname, password } = req.body;
    const newUser = await createNewUser(email, nickname, password);
    return res.json(newUser);
  } catch (error) {
    next(error);
  }
}
export async function patchUser(req, res, next) {
  try {
    const updatedUser = await updateUserById(req.user.userId, req.body);
    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function patchUserPassword(req, res, next) {
  try {
    const updatedUser = await changeUserPassword(
      req.user.userId,
      req.body.password
    );
    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function getUserProduct(req, res, next) {
  try {
    const products = await getProducts(req.user.userId);
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function refreshUserAccessToken(req, res, next) {
  try {
    const accessToken = await refreshAccessToken(
      req.user.userId,
      req.cookies.refreshToken
    );
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export async function getLikedProduct(req, res, next) {
  try {
    const products = await fetchLikedProduct(req.user.userId);
    return res.json(products);
  } catch (error) {
    next(error);
  }
}
