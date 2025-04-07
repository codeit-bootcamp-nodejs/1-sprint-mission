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

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProductList)
  .post(verifyAccessToken, postProduct);

productRouter
  .route("/:id")
  .get(verifyAccessToken, getProduct)
  .patch(verifyAccessToken, verifyProductAuthor, patchProduct)
  .delete(verifyAccessToken, verifyProductAuthor, deleteProduct);

productRouter
  .route("/:id/like")
  .post(verifyAccessToken, postProductLike)
  .delete(verifyAccessToken, deleteProductLike);
export default productRouter;
