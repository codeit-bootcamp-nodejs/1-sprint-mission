import { create } from "superstruct";
import productService from "../services/productService.js";
import { catchHandler } from "../lib/catchHandler.js";
import {
  CreateProductBodyStuct,
  GetProducList,
  UpdateProductBodyStuct,
} from "../structs/productStruct.js";
import { IdParamsStruct } from "../structs/commonStruct.js";

export const getProuct = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page, pageSize, orderBy, search } = create(req.query, GetProducList);
  const products = await productService.getUserAll({
    page,
    pageSize,
    orderBy,
    search,
    userId,
  });
  res.status(200).send(products);
});

export const createProduct = catchHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = create(req.body, CreateProductBodyStuct);
  const product = await productService.createProduct({
    data,
    authorId: userId,
  });

  res.status(201).send(product);
});

export const getProductDetail = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getById(id);

  res.status(200).send(product);
});

export const patchProduct = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStuct);
  const updateProduct = await productService.update(id, data);

  res.status(201).send(updateProduct);
});

export const deleteProduct = catchHandler(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(req.params.id);
  res.sendStatus(204);
});
