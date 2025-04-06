import { Request, Response } from "express";
import productService from "../services/productService";
import asyncHandler from "../utils/asyncHandler";
import { CustomRequest } from "../types/express";

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const { offset, limit, order, search } = req.query as {
    offset?: string;
    limit?: string;
    order?: string;
    search?: string;
  };

  const products = await productService.getAllProducts({
    offset: offset ? parseInt(offset, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    order,
    search,
  });

  res.status(200).send(products);
});

const createProduct = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.user;
    const productData = req.body;

    const createdProduct = await productService.createProduct(
      productData,
      userId
    );
    res.status(201).send(createdProduct);
  }
);

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }

  res.status(200).send(product);
});

const updateProduct = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;

    const updatedProduct = await productService.updateProduct(
      id,
      req.body,
      userId
    );
    res.status(200).send(updatedProduct);
  }
);

const deleteProduct = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;

    await productService.deleteProduct(id, userId);
    res.status(200).send({ message: "Product deleted successfully" });
  }
);

const toggleFavorite = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { productId } = req.params;
    const { userId } = req.user;

    const favoriteProduct = await productService.toggleFavorite(
      userId,
      productId
    );
    res.status(200).json(favoriteProduct);
  }
);

export default {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleFavorite,
};
