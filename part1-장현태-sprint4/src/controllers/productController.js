import {
  fetchProducts,
  getProductById,
  createNewProduct,
  updateProductById,
  removeProductById,
  addProductLike,
  cancelProductLike,
  checkIsLikedByUser,
} from "../services/product.js";
import { assert } from "superstruct";
import { createProduct as createArticleSchema } from "../config/requestValidation.js";

export async function getProductList(req, res, next) {
  try {
    const products = await fetchProducts(req.query);
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    const isLiked = await checkIsLikedByUser(req.user.userId, id);
    return res.json({ ...product, isLiked: isLiked });
  } catch (error) {
    next(error);
  }
}

export async function postProduct(req, res, next) {
  try {
    assert(req.body, createArticleSchema);
    const product = await createNewProduct(req.user.userId, req.body);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function patchProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updatedProduct = await updateProductById(id, req.body);
    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await removeProductById(id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function postProductLike(req, res, next) {
  try {
    await addProductLike(req.user.userId, req.params.id);
    return res.json({ message: "Like it!" });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductLike(req, res, next) {
  try {
    await cancelProductLike(req.user.userId, req.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}
