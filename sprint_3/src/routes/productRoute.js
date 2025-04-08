import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProuct,
  patchProduct,
  getUserProuct,
} from "../controllers/productController.js";

import auth from "../lib/jwtAuth.js";
import { verifyProductAuth } from "../lib/tokenAuth.js";

const productRoute = express.Router();

productRoute.get("/", auth.verifyAccessToken, getProuct);
productRoute.get("/user", auth.verifyAccessToken, getUserProuct);
productRoute.post("/", auth.verifyAccessToken, createProduct);
productRoute.get("/:id", getProductDetail);
productRoute.patch(
  "/:id",
  auth.verifyAccessToken,
  verifyProductAuth,
  patchProduct
);
productRoute.delete(
  "/:id",
  auth.verifyAccessToken,
  verifyProductAuth,
  deleteProduct
);

export default productRoute;
