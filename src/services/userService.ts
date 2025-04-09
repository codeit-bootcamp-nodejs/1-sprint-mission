import {
  getByUserId,
  getFavoriteProduct,
  getMyProductList,
  updateMe,
} from '../repositories/userRepository';
import { UserWithoutPassword } from '../types/user';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { updateUserDTO } from '../DTO/userDTO';
import bcrypt from 'bcrypt';
import { ParamsDTO } from '../DTO/commonDTO';
import { Product } from '../types/product';
import { favoriteProductDTO } from '../DTO/favoriteDTO';
import { GetProductDTO } from '../DTO/productDTO';

export async function getMeService(userId: number): Promise<UserWithoutPassword> {
  const user = await getByUserId(userId);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function updateMeService(userId: number, data: updateUserDTO) {
  const user = await getByUserId(userId);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const updatedUser = await updateMe(userId, data);
  const { password: _, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
}

export async function updateMyPasswordService(
  userId: number,
  password: string,
  newPassword: string,
): Promise<void> {
  const user = await getByUserId(userId);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await updateMe(userId, { password: hashedPassword });
}

export async function getMyProductListService(
  userId: number,
  params: ParamsDTO,
): Promise<{ productList: GetProductDTO[] }> {
  const { page, pageSize, orderBy = 'recent', keyword } = params;
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};

  const products = await getMyProductList(userId, page, pageSize, orderBy, where);

  const productList = products.map((product) => favoriteProductDTO(product, userId));

  return { productList };
}

export async function getMyFavoriteListService(
  userId: number,
  params: ParamsDTO,
): Promise<{ productList: GetProductDTO[] }> {
  const user = await getByUserId(userId);

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const products = await getFavoriteProduct(userId, params);

  const productList = products.map((product) => favoriteProductDTO(product, userId));

  return { productList };
}
