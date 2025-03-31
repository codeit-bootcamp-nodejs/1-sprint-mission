import productService from "../services/productService.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const { offset, limit, order, search } = req.query;
  const products = await productService.getAllProducts({
    offset,
    limit,
    order,
    search,
  });
  res.status(200).send(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const productData = req.body;

  const createdProduct = await productService.createProduct(
    productData,
    userId
  );

  res.status(201).send(createdProduct);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }

  res.status(200).send(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const updatedProduct = await productService.updateProduct(
    id,
    req.body,
    userId
  );
  res.status(200).send(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  await productService.deleteProduct(id, userId);
  res.status(200).send({ message: "Product deleted successfully" });
});

async function toggleFavorite(req, res) {
  const { productId } = req.params;
  const { userId } = req.user;

  const favoriteProduct = await productService.toggleFavorite(
    userId,
    productId
  );

  res.status(200).json(favoriteProduct);
}

export default {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleFavorite,
};
