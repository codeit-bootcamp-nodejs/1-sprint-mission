import productRepository from "../repositories/productRepository";
import favoriteRepository from "../repositories/favoriteRepository";
import { CreateProduct, PatchProduct } from "../struct";
import { assert } from "superstruct";

interface ProductQuery {
  offset?: number;
  limit?: number;
  order?: string;
  search?: string;
}

async function getAllProducts({
  offset = 0,
  limit = 10,
  order = "recent",
  search = "",
}: ProductQuery) {
  return await productRepository.findAll({ offset, limit, order, search });
}

async function createProduct(productData: unknown, userId: string) {
  assert(productData, CreateProduct);
  return await productRepository.save({ ...(productData as any), userId });
}

async function getProductById(id: string) {
  return await productRepository.getById(id);
}

async function updateProduct(id: string, data: unknown, userId: string) {
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

async function deleteProduct(id: string, userId: string) {
  const product = await productRepository.getById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.userId !== userId) {
    throw new Error("You do not have permission to delete this product");
  }
  return await productRepository.remove(id);
}

async function getUserProducts(userId: string) {
  const products = await productRepository.getByUserId(userId);
  if (!products || products.length === 0) {
    const error: any = new Error("No products found for this user");
    error.code = 404;
    throw error;
  }
  return products;
}

async function toggleFavorite(userId: string, productId: string) {
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
