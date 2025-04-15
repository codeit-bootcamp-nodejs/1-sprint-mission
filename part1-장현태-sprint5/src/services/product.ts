import productRepository from "../repositories/productRepository";
import likeRepository from "../repositories/likeRepository";

export async function fetchProducts(query: {
  offset: string;
  limit: string;
  order: string;
  search: string;
}) {
  return await productRepository.getAll(query);
}

export async function getProductById(id: string) {
  return await productRepository.getById(id);
}

export async function createNewProduct(
  userId: string,
  productData: {
    name: string;
    description: string;
    price: number;
    tags: string[];
  }
) {
  return await productRepository.save(userId, productData);
}

export async function updateProductById(
  id: string,
  product: {
    name: string;
    description: string;
    price: number;
    tags: string[];
  }
) {
  const NewproductData = {
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
  };
  return await productRepository.update(id, NewproductData);
}

export async function removeProductById(id: string) {
  return await productRepository.deleteById(id);
}

export async function addProductLike(userId: string, productId: string) {
  await likeRepository.saveProductLike(Number(userId), productId);
  return;
}

export async function cancelProductLike(userId: string, productId: string) {
  await likeRepository.deleteProductLike(Number(userId), productId);
  return;
}

export async function checkIsLikedByUser(userId: string, productId: string) {
  const LikedProducts = await productRepository.getAllLikedProduct(userId);
  for (const product of LikedProducts) {
    return product.id === productId;
  }
}

export async function getProductsByUserId(userId: string) {
  const products = await productRepository.getByUserId(userId);
  return products;
}
