import express from "express";
import { withAsync } from "../middleware/withAsync";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  postProductsLike,
  deleteProductsLike,
  getUserProducts,
  getUserLikeProducts,
} from "../controllers/productsController";
import { verifyAccessToken, verifyProductAuth } from "../middleware/auth";

const productsRouter = express.Router();

productsRouter.get("/likes", verifyAccessToken, withAsync(getUserLikeProducts));
productsRouter.post("/", verifyAccessToken, withAsync(createProduct));
productsRouter.get("/:id", withAsync(getProduct));
productsRouter.patch(
  "/:id",
  verifyAccessToken,
  verifyProductAuth,
  withAsync(updateProduct)
);
productsRouter.post(
  "/likes/:productId",
  verifyAccessToken,
  withAsync(postProductsLike)
);
productsRouter.delete(
  "/likes/:productId",
  verifyAccessToken,
  withAsync(deleteProductsLike)
);
productsRouter.delete(
  "/:id",
  verifyAccessToken,
  verifyProductAuth,
  withAsync(deleteProduct)
);
productsRouter.get("/", withAsync(getProductList));
productsRouter.post(
  "/:id/comments",
  verifyAccessToken,
  withAsync(createComment)
);
productsRouter.get("/:id/comments", withAsync(getCommentList));
productsRouter.get("/user/:userId", withAsync(getUserProducts));

export default productsRouter;
