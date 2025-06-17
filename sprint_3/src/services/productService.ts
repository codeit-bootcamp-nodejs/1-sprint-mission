
import { ProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import NotFoundError from "../lib/error/NotFoundError";
import productRepository from "../repositories/productRepository";
import notificationService from "../services/notificationService";
import { Type } from "@prisma/client";
import { sendNotificationToUser } from "../services/websocket";
import likeService from "../services/likeService";

const getAll = async (
  page: number,
  pageSize: number,
  orderBy: string,
  userId?: number,
  search?: string
) => {
  const products = await productRepository.getAll(
    page,
    pageSize,
    orderBy,
    userId,
    search
  );

  return products;
};

const createProduct = async (data: ProductDTO, authorId: number) => {
  return productRepository.save(data, authorId);
};

const getById = async (id: number) => {
  const product = await productRepository.getById(id);

  if (!product) {
    throw new NotFoundError("제품");
  }

  return product;
};

const update = async (id: number, product: UpdateProductDTO) => {

  if (product.price) {
    const likePeople = await likeService.findByProductId(id);

    if (likePeople) {
      const authorIds = likePeople.map((a) => a.authorId);
      const notifications = await notificationService.create(
        authorIds,
        "PRICE" as Type
      );
      await Promise.all(
        notifications.map((noti) =>
          sendNotificationToUser(noti.userId, noti.content)
        )
      );
    }
  }
  return await productRepository.update(id, product);
};

const deleteProduct = async (id: number) => {
  return await productRepository.deleteProduct(id);
};

export default {
  createProduct,
  getById,
  update,
  deleteProduct,
  getAll,
};
