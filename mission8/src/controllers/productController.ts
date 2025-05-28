import {
  fetchProducts,
  getProductById,
  createNewProduct,
  updateProductById,
  removeProductById,
  addProductLike,
  cancelProductLike,
  checkIsLikedByUser,
  getProductsByUserId,
} from "../services/productService";
import { assert } from "superstruct";
import { createProduct as createArticleSchema } from "../config/requestValidation";
import { RequestHandler } from "express";

export const getProductList: RequestHandler = async function (req, res, next) {
  const query = {
    offset: (req.query.offset as string | undefined) ?? "0",
    limit: (req.query.limit as string | undefined) ?? "10",
    order: (req.query.order as string | undefined) ?? "newest",
    search: (req.query.search as string | undefined) ?? "",
  };
  const products = await fetchProducts(query);
  return res.json(products);
};

export const getProduct: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  const product = await getProductById(id);
  const isLiked = await checkIsLikedByUser(req.user!.userId, id);
  return res.json({ ...product, isLiked: isLiked });
};

export const postProduct: RequestHandler = async function (req, res, next) {
  assert(req.body, createArticleSchema);

  const product = await createNewProduct(req.user!.userId, {
    ...req.body,
    tags: req.body.tags as string[],
  });
  return res.status(201).json(product);
};

export const patchProduct: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  const updatedProduct = await updateProductById(id, req.body);
  return res.json(updatedProduct);
};

export const deleteProduct: RequestHandler = async function (req, res, next) {
  const { id } = req.params;
  await removeProductById(id);
  return res.status(204).end();
};

export const postProductLike: RequestHandler = async function (req, res, next) {
  await addProductLike(req.user!.userId, req.params.id);
  return res.json({ message: "Like it!" });
};

export const deleteProductLike: RequestHandler = async function (
  req,
  res,
  next
) {
  await cancelProductLike(req.user!.userId, req.params.id);
  return res.status(204).end();
};

export const getUserProduct: RequestHandler = async (req, res, next) => {
  const products = await getProductsByUserId(req.user!.userId);
  return res.json(products);
};