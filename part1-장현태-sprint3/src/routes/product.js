import express from "express";
import {
  getProductList,
  postProduct,
  patchProduct,
  deleteProduct,
} from "../api/product.js";
import { postProductValidation } from "../middleware/requestValidation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(asyncHandler(getProductList))
  .post(postProductValidation, asyncHandler(postProduct));

productRouter
  .route("/:id")
  .patch(asyncHandler(patchProduct))
  .delete(asyncHandler(deleteProduct));

export default productRouter;
