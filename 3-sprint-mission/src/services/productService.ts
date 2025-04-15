import productRepository from "../repositories/productRepository";
import { Product } from "../dto/index";

async function createProduct(userId: number, product: Product) {
  if (!product.name || !product.price) {
    throw new Error("required data");
  }
  if (!userId) {
    throw new Error("userId not found");
  }
  return await productRepository.save(userId, product);
}

async function getProduct(id: number) {
  const parseIntId = id;
  if (!id) {
    throw new Error("product id required");
  }
  return await productRepository.getById(parseIntId);
}

async function updateProduct(id: number, data: Product) {
  const parseIntId = id;
  const product = await productRepository.getById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return await productRepository.update(parseIntId, data);
}

async function removeProduct(id: number, userId: number) {
  const parseIntId = id;
  const product = await productRepository.getById(id);
  console.log(parseIntId, userId);
  if (!product) {
    throw new Error("Product not found");
  }

  return await productRepository.remove(parseIntId);
}

async function getProductList(
  page: number,
  pageSize: number,
  orderBy: "recent" | "oldset",
  keyword: string
) {
  try {
    const result = await productRepository.getProductList(
      page,
      pageSize,
      orderBy,
      keyword
    );
    return result;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

async function addLike(userId: number, productId: number) {
  const parseIntProductId = productId;

  if (!parseIntProductId) {
    throw new Error("product not found");
  }

  const product = await productRepository.getById(parseIntProductId);

  if (!product) {
    throw new Error("product not found");
  }

  await productRepository.addLike(userId, parseIntProductId);

  return { isliked: true };
}

async function deleteLike(userId: number, productId: number) {
  const parseIntProductId = productId;

  if (!parseIntProductId) {
    throw new Error("product not found");
  }

  const product = await productRepository.getById(parseIntProductId);

  if (!product) {
    throw new Error("product not found");
  }

  await productRepository.deleteLike(userId, parseIntProductId);

  return { isliked: false };
}

async function getUserProducts(userId: number) {
  const products = await productRepository.getUserId(userId);
  if (!products || products.length === 0) {
    throw new Error("not found");
  }
  return products;
}

async function getUserLikeProducts(userId: number) {
  const products = await productRepository.userLikeProducts(userId);
  if (!products || products.length === 0) {
    throw new Error("not found");
  }
  return products;
}

export default {
  createProduct,
  getProduct,
  updateProduct,
  removeProduct,
  getProductList,
  addLike,
  deleteLike,
  getUserProducts,
  getUserLikeProducts,
};
