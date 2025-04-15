import { create } from "superstruct";
import productService from "../services/productService.js";
import {
  CreateProductBodyStuct,
  GetProducList,
  UpdateProductBodyStuct,
} from "../structs/productStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";

export const getProuct = async (req, res) => {
  const userId = req.user.userId;
  const { page, pageSize, orderBy, search } = create(req.query, GetProducList);
  const products = await productService.getAll({
    page,
    pageSize,
    orderBy,
    search,
    userId,
  });
  res.status(200).send(products);
};

export const getUserProuct = async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, pageSize = 10, orderBy } = req.query;
  const products = await productService.getUserAll({
    page,
    pageSize,
    orderBy,
    userId,
  });
  res.status(200).send(products);
};

export const createProduct = async (req, res) => {
  const userId = req.user.userId;
  const data = create(req.body, CreateProductBodyStuct);
  const product = await productService.createProduct({
    data,
    authorId: userId,
  });

  res.status(201).send(product);
};

export const getProductDetail = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getById(id);

  res.status(200).send(product);
};

export const patchProduct = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStuct);
  const updateProduct = await productService.update(id, data);

  res.status(201).send(updateProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(req.params.id);
  res.sendStatus(204);
};
