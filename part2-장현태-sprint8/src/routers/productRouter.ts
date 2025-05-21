import express from "express";
import {
  getProductList,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
  postProductLike,
  deleteProductLike,
} from "../controllers/productController";
import { verifyAccessToken, verifyProductAuthor } from "../middleware/jwtAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(asyncHandler(getProductList))
  .post(verifyAccessToken, asyncHandler(postProduct));

productRouter
  .route("/:id")
  .get(verifyAccessToken, asyncHandler(getProduct))
  .patch(verifyAccessToken, verifyProductAuthor, asyncHandler(patchProduct))
  .delete(verifyAccessToken, verifyProductAuthor, asyncHandler(deleteProduct));

productRouter
  .route("/:id/like")
  .post(verifyAccessToken, asyncHandler(postProductLike))
  .delete(verifyAccessToken, asyncHandler(deleteProductLike));
export default productRouter;
