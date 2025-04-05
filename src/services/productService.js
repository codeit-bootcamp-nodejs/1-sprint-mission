import productRepository from "../repositories/productRepository.js";
import favoriteRepository from "../repositories/favoriteRepository.js";
import { CreateProduct, PatchProduct } from "../struct.js";
import { assert } from "superstruct";

async function getAllProducts({
  offset = 0,
  limit = 10,
  order = "recent",
  search = "",
}) {
  return await productRepository.findAll({ offset, limit, order, search });
}

async function createProduct(productData, userId) {
  assert(productData, CreateProduct);
  return await productRepository.save({ ...productData, userId });
}

async function getProductById(id) {
  return await productRepository.getById(id);
}

async function updateProduct(id, data, userId) {
  assert(data, PatchProduct);
  const product = await productRepository.getById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.userId !== userId) {
    throw new Error("You do not have permission to update this product");
  }
  return await productRepository.update(id, data);
}

async function deleteProduct(id, userId) {
  const product = await productRepository.getById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.userId !== userId) {
    throw new Error("You do not have permission to delete this product");
  }
  return await productRepository.remove(id);
}

async function getUserProducts(userId) {
  const products = await productRepository.getByUserId(userId);
  if (!products || products.length === 0) {
    const error = new Error("No products found for this user");
    error.code = 404;
    throw error;
  }
  return products;
}

async function toggleFavorite(userId, productId) {
  const existingFavorite = await favoriteRepository.findFavorite(
    userId,
    productId
  );

  if (existingFavorite) {
    await favoriteRepository.removeFavorite(existingFavorite.id);
    return { message: "Favorite removed" };
  }

  const newFavorite = await favoriteRepository.saveFavorite(userId, productId);
  return { message: "Favorite added", product: newFavorite };
}

export default {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
  toggleFavorite,
};
