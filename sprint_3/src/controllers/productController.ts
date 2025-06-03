import { create } from "superstruct";
import productService from "../services/productService";
import {
  CreateProductBodyStuct,
  GetProductList,
  UpdateProductBodyStuct,
} from "../structs/productStruct";
import { IdParamsStruct } from "../structs/commonStruct";
import { RequestHandler } from "express";

export const getProuct: RequestHandler = async (req, res) => {
  const userId = req.user?.id ?? null;
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
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStuct);
  const updateProduct = await productService.update(id, data);
  res.status(201).send(updateProduct);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id);
  res.sendStatus(204);
};
