import productRepository from "../repositories/productRepository.js";
import likeRepository from "../repositories/likeRepository.js";

export async function fetchProducts(query) {
  return await productRepository.getAll(query);
}

export async function getProductById(id) {
  return await productRepository.getById(id);
}

export async function createNewProduct(userId, productData) {
  return await productRepository.save(userId, productData);
}

export async function updateProductById(id, product) {
  const NewproductData = {
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
  };
  return await productRepository.update(id, NewproductData);
}

export async function removeProductById(id) {
  return await productRepository.deleteById(id);
}

export async function addProductLike(userId, productId) {
  await likeRepository.saveProductLike(userId, productId);
  return;
}

export async function cancelProductLike(userId, productId) {
  await likeRepository.deleteProductLike(userId, productId);
  return;
}

export async function checkIsLikedByUser(userId, productId) {
  const LikedProducts = await productRepository.getAllLikedProduct(userId);
  for (const product of LikedProducts) {
    if (product.id === productId) return true;
    return false;
  }
}
