import { create } from "superstruct";
import productService from "../services/productService";
import {
  CreateProductBodyStuct,
  GetProductList,
  UpdateProductBodyStuct,
} from "../structs/productStruct";
import { IdParamsStruct } from "../structs/commonStruct";
import { RequestHandler } from "express";
import UnauthorizedError from "../lib/error/UnauthorizedError";
import notificationService from "../services/notificationService";
import { Type } from "@prisma/client";
import { sendNotificationToUser } from "../services/websocket";
import likeService from "../services/likeService";

export const getProuct: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const { page, pageSize, orderBy, search } = create(req.query, GetProductList);
  const products = await productService.getAll(
    page,
    pageSize,
    orderBy,
    userId,
    search
  );
  res.status(200).send(products);
};

export const createProduct: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const data = create(req.body, CreateProductBodyStuct);
  const product = await productService.createProduct(data, userId);

  res.status(201).send(product);
};

export const getProductDetail: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getById(id);

  res.status(200).send(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStuct);
  const updateProduct = await productService.update(id, data);

  if (data.price) {
    const likePeople = await likeService.findByProductId(id);
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

  res.status(201).send(updateProduct);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id);
  res.sendStatus(204);
};
