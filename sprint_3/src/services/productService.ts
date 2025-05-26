import { ProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import NotFoundError from "../lib/error/NotFoundError";
import productRepository from "../repositories/productRepository";

const getAll = async (
  page: number,
  pageSize: number,
  orderBy: string,
  userId?: number,
  search?: string
) => {
  const products = await productRepository.getAll(
    page,
    pageSize,
    orderBy,
    userId,
    search
  );

  return products;
};

const createProduct = async (data: ProductDTO, authorId: number) => {
  return productRepository.save(data, authorId);
};

const getById = async (id: number) => {
  const product = await productRepository.getById(id);

  if (!product) {
    throw new NotFoundError("제품");
  }

  return product;
};

const update = async (id: number, product: UpdateProductDTO) => {
  return await productRepository.update(id, product);
};

const deleteProduct = async (id: number) => {
  return await productRepository.deleteProduct(id);
};

export default {
  createProduct,
  getById,
  update,
  deleteProduct,
  getAll,
};
